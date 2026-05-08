import AccountRow from "./AccountRow";
import { CoachType } from "@/utils/CoachType";

type Props = {
  accounts: CoachType[];
  startIndex: number;
  onPressAccount: (account: CoachType) => void;
  updateStatusAccount: (coachId: string, active: boolean) => void;
};

const AccountTable = ({
  accounts,
  startIndex,
  onPressAccount,
  updateStatusAccount,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700 w-14">
            STT
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ảnh
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Họ tên
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Giới tính
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Giá/giờ
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Đánh giá
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày đăng ký
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trạng thái
          </th>
        </tr>
      </thead>
      <tbody>
        {accounts.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          accounts.map((acc, idx) => (
            <AccountRow
              key={acc.coachId}
              account={acc}
              index={startIndex + idx + 1}
              onPressAccount={onPressAccount}
              updateStatusAccount={updateStatusAccount}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default AccountTable;
