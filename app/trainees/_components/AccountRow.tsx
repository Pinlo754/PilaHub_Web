import { TraineeType } from "@/utils/TraineeType";
import { formatLocalDateTime } from "@/utils/day";
import { getGenderConfig, getWorkoutLevelConfig } from "@/utils/uiMapper";
import { Trash2 } from "lucide-react";

type Props = {
  account: TraineeType;
  onPressAccount: (account: TraineeType) => void;
  deleteTrainee: (traineeId: string, fullName: string) => void;
};

const AccountRow = ({ account, onPressAccount, deleteTrainee }: Props) => {
  const genderConfig = getGenderConfig(account.gender);
  const levelConfig = getWorkoutLevelConfig(account.workoutLevel);
  const shortId = `${account.traineeId.slice(0, 6)}...`;

  return (
    <tr
      onClick={() => onPressAccount(account)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4 text-gray-500">{shortId}</td>
      <td className="py-3 px-4 flex justify-center">
        <img
          src={account.avatarUrl || "/default-logo.png"}
          alt={account.fullName}
          className="w-10 h-10 object-cover rounded-full border"
        />
      </td>
      <td className="py-3 px-4 text-gray-700">{account.fullName}</td>
      <td className="py-3 px-4 text-center text-gray-700">{account.age}</td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${genderConfig.bgColor} ${genderConfig.textColor}`}
        >
          {genderConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${levelConfig.bgColor} ${levelConfig.textColor}`}
        >
          {levelConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {formatLocalDateTime(account.createdAt, "datetime")}
      </td>
      {/* <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTrainee(account.traineeId, account.fullName);
          }}
          className="p-2 rounded-md transition inline-flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200"
        >
          <Trash2 size={16} />
        </button>
      </td> */}
    </tr>
  );
};

export default AccountRow;
