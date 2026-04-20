import { TraineeType } from "@/utils/TraineeType";
import AccountRow from "./AccountRow";

type Props = {
  accounts: TraineeType[];
  onPressAccount: (account: TraineeType) => void;
  deleteTrainee: (traineeId: string, fullName: string) => void;
};

const AccountTable = ({ accounts, onPressAccount, deleteTrainee }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mã HV
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
        {accounts.map((acc) => (
          <AccountRow
            key={acc.traineeId}
            account={acc}
            onPressAccount={onPressAccount}
            deleteTrainee={deleteTrainee}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AccountTable;
