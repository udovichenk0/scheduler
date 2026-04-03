package projectmembershiprepoport

type GetInput struct {
	ProjectId string
	UserId    string
}

type CreateOneInput struct {
	ProjectId string
	UserId    string
}

type Repository interface {
	// Get(ctx context.Context, params GetInput) (model.ProjectMembership, error)
	// CreateOne(ctx context.Context, params CreateOneInput) error
}
