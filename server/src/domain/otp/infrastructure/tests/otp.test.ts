import { createMockContext } from "src/services/clients/prisma";
import { OTPRepository } from "../repository/otp.repository";
import { OTPService } from "../../otp.service";
import { UserRepository } from "src/domain/user/infrastructure/repository/user.repository";
import { UserService } from "src/domain/user/user.service";
import { EmailTransporter } from "src/services/nodemailer/client";
import { Errors } from "src/services/err/errors";

let otpRepository: OTPRepository;
let otpService: OTPService;
let transporter: EmailTransporter;
let userService: UserService;
beforeEach(() => {
  const prisma = createMockContext().prisma;
  otpRepository = new OTPRepository(prisma);
  userService = new UserService(new UserRepository(prisma));
  transporter = new EmailTransporter();
  otpService = new OTPService(userService, otpRepository, transporter);
});

//send email
test("should send an email", async () => {
  jest.spyOn(transporter, "sendEmail");
  const code = "123456";
  const email = "realemail@gmail.com";
  otpService.sendEmail({ email, code });

  expect(transporter.sendEmail).toBeCalledWith({
    to: email,
    code,
    subject: "Verify your email"
  });
});

test("should return Err object if email is not valid", async () => {
  const code = "123456";
  const email = "invalidemail";
  const result = otpService.sendEmail({ email, code });
  expect(result).toEqual(Errors.GeneralInvalid("Email", email));
});

test("should return Err object if code is missing", async () => {
  const code = "123456";
  const email = "realemail@gmail.com";
  //@ts-ignore
  const codeMissing = otpService.sendEmail({ email });
  //@ts-ignore
  const emailMissing = otpService.sendEmail({ code });

  expect(codeMissing).toEqual(Errors.Missing("Code"));
  expect(emailMissing).toEqual(Errors.Missing("Email"));
});
//verify otp
test("should verify otp", async () => {
  const code = "123456";
  const email = "useremail@gmail.com";
  const user = {
    email,
    id: "user_id",
    verified: false,
    created_at: new Date(),
    hash: "hash"
  };
  jest
    .spyOn(otpRepository, "findByUserEmail")
    .mockResolvedValue({ code, user });
  jest
    .spyOn(otpRepository, "deleteByUserId")
    .mockResolvedValue({ id: "123", code, user_id: user.id });
  const inputCode = "123456";
  const result = await otpService.verifyOTP({ email, code: inputCode });

  expect(result).toEqual({ code, user });
  expect(otpRepository.deleteByUserId).toBeCalledWith(user.id);
});
test("should return Err object if input code is invalid", async () => {
  const code = "123456";
  const email = "useremail@gmail.com";
  const user = {
    email,
    id: "user_id",
    verified: false,
    created_at: new Date(),
    hash: "hash"
  };
  jest
    .spyOn(otpRepository, "findByUserEmail")
    .mockResolvedValue({ code, user });
  jest.spyOn(otpRepository, "deleteByUserId");
  const inputCode = "wrong_code";
  const result = await otpService.verifyOTP({ email, code: inputCode });

  expect(result).toEqual(Errors.GeneralInvalid("Code", code));
  expect(otpRepository.deleteByUserId).not.toBeCalled();
});

test("should return Err object if arguments are invalid or missing", async () => {
  const code = "123456";
  const email = "useremail@gmail.com";
  const user = {
    email,
    id: "user_id",
    verified: false,
    created_at: new Date(),
    hash: "hash"
  };
  jest
    .spyOn(otpRepository, "findByUserEmail")
    .mockResolvedValue({ code, user });
  jest.spyOn(otpRepository, "deleteByUserId");
  //@ts-ignore
  const codeMissing = await otpService.verifyOTP({ email });
  //@ts-ignore
  const emailMissing = await otpService.verifyOTP({ code });
  const invalidEmail = await otpService.verifyOTP({
    code,
    email: "invalidemail"
  });

  expect(codeMissing).toEqual(Errors.Missing("Code"));
  expect(emailMissing).toEqual(Errors.Missing("Email"));
  expect(invalidEmail).toEqual(Errors.GeneralInvalid("Email", "invalidemail"));
});

//resend otp
test("should resend otp", async () => {
  const email = "useremail@gmail.com";
  const user = {
    email,
    id: "user_id",
    verified: false,
    created_at: new Date(),
    hash: "hash"
  };
  const otp = {
    id: "id",
    code: "123456",
    user_id: "user_id"
  };
  jest.spyOn(userService, "findByEmail").mockResolvedValue(user);
  jest.spyOn(otpService, "create").mockResolvedValue(otp);
  jest.spyOn(otpService, "sendEmail");
  await otpService.resendOTP(email);
  expect(otpService.sendEmail).toBeCalled();
});

test("should return Err object if arguments are missing or invalid", async () => {
  //@ts-ignore
  const emailMissing = await otpService.resendOTP();
  const email = "invalidemail";
  const invalidEmail = await otpService.resendOTP(email);
  expect(emailMissing).toEqual(Errors.Missing("Email"));
  expect(invalidEmail).toEqual(Errors.GeneralInvalid("Email", email));
});
