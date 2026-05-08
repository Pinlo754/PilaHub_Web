import { ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  imagePreview: string;
  imageUrl: string;
  uploading: boolean;
  progress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
};

export const ImageUploadField = ({
  imagePreview,
  imageUrl,
  uploading,
  progress,
  onFileChange,
  onUrlChange,
}: Props) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0">
      {imagePreview || imageUrl ? (
        <img
          src={imagePreview || imageUrl}
          alt="preview"
          className="w-24 h-24 rounded-xl object-cover border-2 border-orange-200"
        />
      ) : (
        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center text-orange-300 gap-1">
          <ImageIcon size={24} />
          <span className="text-xs">Ảnh</span>
        </div>
      )}
    </div>
    <div className="flex-1">
      <Label>Ảnh sản phẩm</Label>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
      />
      {uploading && (
        <p className="text-xs text-orange-500 mt-1">
          Đang tải ảnh... {Math.round(progress)}%
        </p>
      )}
      <p className="text-xs text-gray-400 mt-1">Hoặc nhập URL trực tiếp:</p>
      <Input
        value={imageUrl}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://..."
        className="mt-1"
      />
    </div>
  </div>
);
