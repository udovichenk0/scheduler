package invitationservice

import (
	invitationserviceport "github.com/udovichenk0/scheduler/internal/ports/api/invitation"
	"github.com/udovichenk0/scheduler/internal/ports/repository/invitation/model"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
)

func toDto(entity model.Invitation) invitationserviceport.Invitation {
	return invitationserviceport.Invitation{
		Id:         entity.Id,
		ProjectId:  entity.ProjectId,
		InviterId:  entity.InviterId,
		Status:     entity.Status,
		InvitedAt:  entity.InvitedAt,
		AcceptedAt: dbutils.NullTimeToPtr(entity.AcceptedAt),
		DeclinedAt: dbutils.NullTimeToPtr(entity.DeclinedAt),
	}
}

func toDtos(entity []model.Invitation) []invitationserviceport.Invitation {
	var dtos []invitationserviceport.Invitation

	for _, e := range entity {
		dtos = append(dtos, toDto(e))
	}
	return dtos
}
