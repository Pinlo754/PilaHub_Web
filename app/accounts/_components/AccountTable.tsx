import { AccountType } from "@/utils/AccountType";
import AccountRow from "./AccountRow";

type Props = {
  accounts: AccountType[];
  onPressAccount: (account: AccountType) => void;
  updateStatusAccount: (accountId: string, active: boolean) => void;
  page: number;
  size?: number;
};

const AccountTable = ({
  accounts,
  onPressAccount,
  updateStatusAccount,
  page,
  size = 10,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            STT
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Email
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Số điện thoại
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Vai trò
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày đăng ký
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
        {accounts.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-10 text-gray-400">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          accounts.map((acc, idx) => (
            <AccountRow
              key={acc.accountId}
              account={acc}
              index={page * size + idx + 1}
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
