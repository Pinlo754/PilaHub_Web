import { AccountType } from "@/utils/AccountType";
import { formatLocalDateTime } from "@/utils/day";
import {
  ACCOUNT_ROLE_MAP,
  ACCOUNT_STATUS_MAP,
  getAccountStatus,
} from "@/utils/uiMapper";
import { Power, PowerOff } from "lucide-react";

type Props = {
  account: AccountType;
  onPressAccount: (account: AccountType) => void;
  updateStatusAccount: (accountId: string, active: boolean) => void;
};

const AccountRow = ({
  account,
  onPressAccount,
  updateStatusAccount,
}: Props) => {
  // VARIABLE
  const status = getAccountStatus(account.emailVerified, account.active);
  const config = ACCOUNT_STATUS_MAP[status];
  const role = ACCOUNT_ROLE_MAP[account.role];

  return (
    <tr
      onClick={() => onPressAccount(account)}
      className="border-b border-orange-100 hover:bg-orange-50"
    >
      <td className="py-3 px-4 text-gray-700">{account.accountId}</td>
      <td className="py-3 px-4 text-gray-700">{account.email}</td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {account.phoneNumber}
      </td>
      <td className="py-3 px-4 text-gray-700 text-center">{role.label}</td>
      <td className="py-3 px-4 text-gray-700 text-center">
        {formatLocalDateTime(account.createdAt)}
      </td>
      <td className="py-3 px-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
        >
          {config.label}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();

            if (!account.emailVerified) return;

            updateStatusAccount(account.accountId, account.active);
          }}
          disabled={!account.emailVerified}
          className={`p-2 rounded-md transition inline-flex items-center justify-center ${
            !account.emailVerified
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : account.active
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          {account.active ? <PowerOff size={16} /> : <Power size={16} />}
        </button>
      </td>
    </tr>
  );
};

export default AccountRow;
