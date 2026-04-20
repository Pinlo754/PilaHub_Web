import { formatLocalDateTime } from "@/utils/day";
import { SystemConfigType } from "@/utils/SystemConfigType";
import {
  formatSystemConfigValue,
  getSystemConfigLabel,
} from "@/utils/uiMapper";
import { Pencil } from "lucide-react";

type Props = {
  config: SystemConfigType;
  onPressConfig: (config: SystemConfigType) => void;
};

const SystemConfigRow = ({ config, onPressConfig }: Props) => {
  return (
    <tr
      onClick={() => onPressConfig(config)}
      className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer"
    >
      <td className="py-3 px-4">
        <span className="text-gray-700 font-medium">
          {getSystemConfigLabel(config.key)}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-500 max-w-[250px] truncate">
        {config.description || "—"}
      </td>
      <td className="py-3 px-4 text-center">
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
          {formatSystemConfigValue(config.key, config.value)}
        </span>
      </td>
      <td className="py-3 px-4 text-center text-gray-500 text-sm">
        {formatLocalDateTime(config.updatedAt, "datetime")}
      </td>
    </tr>
  );
};

export default SystemConfigRow;
