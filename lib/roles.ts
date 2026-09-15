export type MembershipRole = "OWNER" | "MEMBER" | "ADMIN";
export const ROLES: Record<MembershipRole, string> = {
  OWNER: "Właściciel",
  MEMBER: "Członek",
  ADMIN: "Administrator",
};
