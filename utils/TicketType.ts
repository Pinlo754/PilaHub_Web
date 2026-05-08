export const TICKET_STATUS = {
  Pending: "PENDING",
  Approved: "APPROVED",
  Rejected: "REJECTED",
} as const;

export type TicketStatusType =
  (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export type TicketRes = {
  ticketId: string;
  accountId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  title: string;
  description: string;
  status: TicketStatusType;
  createdAt: string;
};

export type TicketType = {
  ticketTypeId: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
};

export type CreateTicketTypeReq = Pick<TicketType, "name" | "description">;

export type UpdateTicketTypeReq = Partial<CreateTicketTypeReq>;
