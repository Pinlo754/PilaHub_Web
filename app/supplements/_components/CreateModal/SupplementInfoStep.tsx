import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "./ImageUploadField";

export type SupplementForm = {
  name: string;
  description: string;
  brand: string;
  form: string;
  usageInstructions: string;
  benefits: string;
  sideEffects: string;
  contraindications: string;
  warnings: string;
  imageUrl: string;
};

export type SupplementFormError = Partial<Record<keyof SupplementForm, string>>;

type Props = {
  form: SupplementForm;
  errors: SupplementFormError;
  touched: Partial<Record<keyof SupplementForm, boolean>>;
  imagePreview: string;
  uploading: boolean;
  progress: number;
  onChange: <K extends keyof SupplementForm>(key: K, value: string) => void;
  onBlur: (key: keyof SupplementForm) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SupplementInfoStep = ({
  form,
  errors,
  touched,
  imagePreview,
  uploading,
  progress,
  onChange,
  onBlur,
  onFileChange,
}: Props) => (
  <div className="space-y-4">
    <ImageUploadField
      imagePreview={imagePreview}
      imageUrl={form.imageUrl}
      uploading={uploading}
      progress={progress}
      onFileChange={onFileChange}
      onUrlChange={(url) => onChange("imageUrl", url)}
    />

    <FieldGroup>
      <Field>
        <Label>
          Tên sản phẩm <span className="text-red-500">*</span>
        </Label>
        <Input
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={() => onBlur("name")}
          placeholder="VD: Vitamin C 1000mg"
        />
        {touched.name && errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </Field>

      <Field>
        <Label>
          Mô tả <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          onBlur={() => onBlur("description")}
          placeholder="Mô tả sản phẩm..."
          rows={2}
        />
        {touched.description && errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label>
            Thương hiệu <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.brand}
            onChange={(e) => onChange("brand", e.target.value)}
            onBlur={() => onBlur("brand")}
            placeholder="VD: Now Foods"
          />
          {touched.brand && errors.brand && (
            <p className="text-xs text-red-500">{errors.brand}</p>
          )}
        </Field>
        <Field>
          <Label>
            Dạng sản phẩm <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.form}
            onChange={(e) => onChange("form", e.target.value)}
            onBlur={() => onBlur("form")}
            placeholder="VD: Viên nén, Bột, Viên nang"
          />
          {touched.form && errors.form && (
            <p className="text-xs text-red-500">{errors.form}</p>
          )}
        </Field>
      </div>

      {(
        [
          "usageInstructions",
          "benefits",
          "sideEffects",
          "contraindications",
          "warnings",
        ] as const
      ).map((key) => (
        <Field key={key}>
          <Label>
            {
              {
                usageInstructions: "Hướng dẫn sử dụng",
                benefits: "Lợi ích",
                sideEffects: "Tác dụng phụ",
                contraindications: "Chống chỉ định",
                warnings: "Cảnh báo",
              }[key]
            }
          </Label>
          <Textarea
            value={form[key]}
            onChange={(e) => onChange(key, e.target.value)}
            rows={2}
            placeholder="..."
          />
        </Field>
      ))}
    </FieldGroup>
  </div>
);
