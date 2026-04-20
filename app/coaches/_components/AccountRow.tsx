import { CoachType } from "@/utils/CoachType";
import { formatLocalDateTime } from "@/utils/day";
import { getActiveConfig, getGenderConfig } from "@/utils/uiMapper";
import { Power, PowerOff } from "lucide-react";

type Props = {
  account: CoachType;
  onPressAccount: (account: CoachType) => void;
  updateStatusAccount: (accountId: string, active: boolean) => void;
};

const AccountRow = ({
  account,
  onPressAccount,
  updateStatusAccount,
}: Props) => {
  const genderConfig = getGenderConfig(account.gender);
  const shortId = `${account.coachId.slice(0, 6)}...`;
  const activeConfig = getActiveConfig(account.active);

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
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${genderConfig.bgColor} ${genderConfig.textColor}`}
        >
          {genderConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {account.pricePerHour.toLocaleString("vi-VN")}đ
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {account.avgRating.toFixed(1)}
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {formatLocalDateTime(account.createdAt)}
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            activeConfig.bgColor
          } ${activeConfig.textColor}`}
        >
          {account.active ? "Đang hoạt động" : "Đã khóa"}
        </span>
      </td>
      {/* <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            updateStatusAccount(account.coachId, account.active);
          }}
          className={`p-2 rounded-md transition inline-flex items-center justify-center ${
            account.active
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          {account.active ? <PowerOff size={16} /> : <Power size={16} />}
        </button>
      </td> */}
    </tr>
  );
};

export default AccountRow;
