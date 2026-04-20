import AccountRow from "./AccountRow";
import { CoachType } from "@/utils/CoachType";

type Props = {
  accounts: CoachType[];
  onPressAccount: (account: CoachType) => void;
  updateStatusAccount: (accountId: string, active: boolean) => void;
};

const AccountTable = ({
  accounts,
  onPressAccount,
  updateStatusAccount,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã HLV
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
          {/* <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th> */}
        </tr>
      </thead>
      <tbody>
        {accounts.map((acc) => (
          <AccountRow
            key={acc.coachId}
            account={acc}
            onPressAccount={onPressAccount}
            updateStatusAccount={updateStatusAccount}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AccountTable;
