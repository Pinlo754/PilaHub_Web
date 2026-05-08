import { TraineeType } from "@/utils/TraineeType";
import AccountRow from "./AccountRow";

type Props = {
  accounts: TraineeType[];
  onPressAccount: (account: TraineeType) => void;
  deleteTrainee: (traineeId: string, fullName: string) => void;
  startIndex: number;
};

const AccountTable = ({
  accounts,
  onPressAccount,
  deleteTrainee,
  startIndex,
}: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            STT
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ảnh
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Họ tên
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Tuổi
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Giới tính
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Trình độ
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Ngày đăng ký
          </th>
          {/* <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Hành động
          </th> */}
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
          accounts.map((acc, index) => (
            <AccountRow
              key={acc.traineeId}
              account={acc}
              onPressAccount={onPressAccount}
              deleteTrainee={deleteTrainee}
              index={startIndex + index + 1}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default AccountTable;
