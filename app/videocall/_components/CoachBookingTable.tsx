import { CoachBookingType } from "@/utils/CoachBookingType";
import CoachBookingRow from "./CoachBookingRow";

type Props = {
  bookings: CoachBookingType[];
  onPressBooking: (booking: CoachBookingType) => void;
  onMarkReady: (bookingId: string) => void;
};

const CoachBookingTable = ({
  bookings,
  onPressBooking,
  onMarkReady,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã đặt lịch
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Học viên
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            HLV
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Thời gian bắt đầu
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Thời gian kết thúc
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Loại
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {bookings.length === 0 ? (
          <tr>
            <td colSpan={8} className="py-10 text-center text-gray-400">
              Không có lịch đặt nào cần chuyển trạng thái
            </td>
          </tr>
        ) : (
          bookings.map((booking) => (
            <CoachBookingRow
              key={booking.id}
              booking={booking}
              onPressBooking={onPressBooking}
              onMarkReady={onMarkReady}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default CoachBookingTable;
