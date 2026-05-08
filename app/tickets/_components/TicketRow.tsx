import { TicketRes, TICKET_STATUS } from "@/utils/TicketType";
import { VendorType } from "@/utils/VendorType";
import { formatLocalDateTime } from "@/utils/day";
import { getTicketStatusConfig } from "@/utils/uiMapper";
import { CheckCircle, XCircle } from "lucide-react";

type Props = {
  item: TicketRes;
  vendor?: VendorType;
  index: number;
  onPress: (item: TicketRes) => void;
  onApprove: (ticketId: string) => void;
  onReject: (ticketId: string) => void;
};

const TicketRow = ({
  item,
  vendor,
  index,
  onPress,
  onApprove,
  onReject,
}: Props) => {
  const statusConfig = getTicketStatusConfig(item.status);
  const isPending = item.status === TICKET_STATUS.Pending;

  return (
    <tr
      onClick={() => onPress(item)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-center text-gray-500 font-medium">
        {index}
      </td>

      <td className="py-3 px-4 text-gray-700 font-medium max-w-xs truncate">
        {item.title}
      </td>

      <td className="py-3 px-4 text-sm text-gray-500">{item.ticketTypeName}</td>

      <td className="py-3 px-4 text-sm text-gray-600">
        {vendor ? (
          <div className="flex items-center gap-2">
            {vendor.logoUrl && (
              <img
                src={vendor.logoUrl}
                alt=""
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span>{vendor.businessName}</span>
          </div>
        ) : (
          <span className="italic text-gray-300 text-xs">{item.accountId}</span>
        )}
      </td>

      <td className="py-3 px-4 text-center text-sm text-gray-500">
        {formatLocalDateTime(item.createdAt)}
      </td>

      <td className="py-3 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
        >
          {statusConfig.label}
        </span>
      </td>

      <td className="py-3 px-4 text-center">
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(item.ticketId);
              }}
              title="Duyệt"
              className="p-2 rounded-md inline-flex items-center justify-center bg-green-100 text-green-600 hover:bg-green-200 transition"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject(item.ticketId);
              }}
              title="Từ chối"
              className="p-2 rounded-md inline-flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-300 italic">—</span>
        )}
      </td>
    </tr>
  );
};

export default TicketRow;
