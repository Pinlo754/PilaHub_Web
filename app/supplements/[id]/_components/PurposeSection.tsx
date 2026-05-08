"use client";

import { useState } from "react";
import {
  SupplementPurposeType,
  UpdateSupplementPurposeReq,
} from "@/utils/SupplementPurposeType";
import { PurposeType } from "@/utils/PurposeType";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Pencil, X, Check, Star } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AddForm = {
  purposeId: string;
  primary: boolean;
  effectivenessNotes: string;
};
type AddError = { purposeId?: string };
type EditForm = { primary: boolean; effectivenessNotes: string };

const validateAdd = (f: AddForm): AddError => {
  const e: AddError = {};
  if (!f.purposeId) e.purposeId = "Chọn mục đích";
  return e;
};

// ─── PurposeCard ──────────────────────────────────────────────────────────────

type CardProps = {
  sp: SupplementPurposeType;
  onUpdate: (id: string, p: UpdateSupplementPurposeReq) => void;
  onDelete: (id: string, name: string) => void;
};

const PurposeCard = ({ sp, onUpdate, onDelete }: CardProps) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    primary: sp.primary,
    effectivenessNotes: sp.effectivenessNotes ?? "",
  });

  const handleSave = () => {
    onUpdate(sp.supplementPurposeId, {
      primary: editForm.primary,
      effectivenessNotes: editForm.effectivenessNotes.trim(),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      primary: sp.primary,
      effectivenessNotes: sp.effectivenessNotes ?? "",
    });
    setEditing(false);
  };

  return (
    <div className="border border-orange-100 rounded-xl p-4 space-y-2 bg-orange-50/20">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-700">{sp.purpose.name}</p>
            {sp.primary && (
              <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium">
                <Star size={10} /> Chính
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-gray-400">{sp.purpose.code}</p>
          {!editing && sp.effectivenessNotes && (
            <p className="text-sm text-gray-500 mt-1">
              {sp.effectivenessNotes}
            </p>
          )}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() =>
                  onDelete(sp.supplementPurposeId, sp.purpose.name)
                }
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="space-y-3 pt-1">
          <Field>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.primary}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, primary: e.target.checked }))
                }
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Mục đích chính
              </span>
            </label>
          </Field>
          <Field>
            <Label>Ghi chú hiệu quả</Label>
            <Textarea
              value={editForm.effectivenessNotes}
              onChange={(e) =>
                setEditForm((p) => ({
                  ...p,
                  effectivenessNotes: e.target.value,
                }))
              }
              placeholder="Ghi chú..."
              rows={2}
            />
          </Field>
        </div>
      )}
    </div>
  );
};

// ─── PurposeSection ───────────────────────────────────────────────────────────

type Props = {
  suppPurposes: SupplementPurposeType[];
  allPurposes: PurposeType[];
  usedPurposeIds: string[];
  onCreate: (p: {
    purposeId: string;
    primary: boolean;
    effectivenessNotes: string;
  }) => void;
  onUpdate: (id: string, p: UpdateSupplementPurposeReq) => void;
  onDelete: (id: string, name: string) => void;
};

const INITIAL_ADD: AddForm = {
  purposeId: "",
  primary: false,
  effectivenessNotes: "",
};

const PurposeSection = ({
  suppPurposes,
  allPurposes,
  usedPurposeIds,
  onCreate,
  onUpdate,
  onDelete,
}: Props) => {
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<AddForm>(INITIAL_ADD);
  const [addErrors, setAddErrors] = useState<AddError>({});

  const available = allPurposes.filter(
    (p) => !usedPurposeIds.includes(p.purposeId),
  );

  const handleSubmitAdd = () => {
    const errs = validateAdd(addForm);
    setAddErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onCreate({
      purposeId: addForm.purposeId,
      primary: addForm.primary,
      effectivenessNotes: addForm.effectivenessNotes.trim(),
    });
    setAddForm(INITIAL_ADD);
    setAddErrors({});
    setShowAdd(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-orange-700">
          Mục đích sử dụng ({suppPurposes.length})
        </h2>
        {available.length > 0 && (
          <button
            onClick={() => setShowAdd((p) => !p)}
            className="flex items-center gap-1.5 text-sm text-orange-600 font-medium hover:text-orange-700"
          >
            <Plus size={16} /> Thêm mục đích
          </button>
        )}
      </div>

      {showAdd && (
        <div className="border-2 border-dashed border-orange-200 rounded-xl p-4 space-y-3 bg-orange-50/20">
          <p className="text-sm font-medium text-orange-700">Mục đích mới</p>
          <Field>
            <Label>Mục đích</Label>
            <select
              value={addForm.purposeId}
              onChange={(e) =>
                setAddForm((p) => ({ ...p, purposeId: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
              <option value="">— Chọn mục đích —</option>
              {available.map((p) => (
                <option key={p.purposeId} value={p.purposeId}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
            {addErrors.purposeId && (
              <p className="text-xs text-red-500">{addErrors.purposeId}</p>
            )}
          </Field>
          <Field>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={addForm.primary}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, primary: e.target.checked }))
                }
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Mục đích chính
              </span>
            </label>
          </Field>
          <Field>
            <Label>Ghi chú hiệu quả</Label>
            <Textarea
              value={addForm.effectivenessNotes}
              onChange={(e) =>
                setAddForm((p) => ({
                  ...p,
                  effectivenessNotes: e.target.value,
                }))
              }
              placeholder="Ghi chú (tuỳ chọn)"
              rows={2}
            />
          </Field>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowAdd(false);
                setAddForm(INITIAL_ADD);
                setAddErrors({});
              }}
            >
              Huỷ
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmitAdd}
              className="bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-700"
            >
              Thêm
            </Button>
          </div>
        </div>
      )}

      {suppPurposes.length === 0 && !showAdd && (
        <p className="text-center py-6 text-gray-400 text-sm">
          Chưa có mục đích nào
        </p>
      )}

      {suppPurposes.map((sp) => (
        <PurposeCard
          key={sp.supplementPurposeId}
          sp={sp}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PurposeSection;
