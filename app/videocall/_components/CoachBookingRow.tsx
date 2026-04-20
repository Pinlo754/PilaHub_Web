import { CoachBookingType } from "@/utils/CoachBookingType";
import { formatLocalDateTime } from "@/utils/day";
import { getBookingStatusConfig, getBookingTypeConfig } from "@/utils/uiMapper";

import { CheckCircle } from "lucide-react";

type Props = {
  booking: CoachBookingType;
  onPressBooking: (booking: CoachBookingType) => void;
  onMarkReady: (bookingId: string) => void;
};

const CoachBookingRow = ({ booking, onPressBooking, onMarkReady }: Props) => {
  const shortId = `${booking.id.slice(0, 6)}...`;
  const statusConfig = getBookingStatusConfig(booking.status);
  const typeConfig = getBookingTypeConfig(booking.bookingType);

  return (
    <tr
      onClick={() => onPressBooking(booking)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-500">{shortId}</td>
      <td className="py-3 px-4 text-gray-700 font-medium">
        {booking.trainee.fullName}
      </td>
      <td className="py-3 px-4 text-gray-700">{booking.coach.fullName}</td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {formatLocalDateTime(booking.startTime)}
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {formatLocalDateTime(booking.endTime)}
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}
        >
          {typeConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
        >
          {statusConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkReady(booking.id);
          }}
          className="p-2 rounded-md transition inline-flex items-center justify-center bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
          title="Đánh dấu Sẵn sàng"
        >
          <CheckCircle size={16} />
        </button>
      </td>
    </tr>
  );
};

export default CoachBookingRow;
