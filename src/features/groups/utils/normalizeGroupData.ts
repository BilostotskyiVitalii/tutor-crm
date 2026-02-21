import { serverTimestamp } from 'firebase/firestore';

import type { Group, GroupData } from '@/features/groups/types/groupTypes';

export function normalizeGroupData(
  formValues: GroupData,
  editedGroup?: Group | null,
): GroupData {
  return {
    ...(Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [
        key,
        value === undefined || value === '' ? null : value,
      ]),
    ) as GroupData),
    ...(editedGroup ? {} : { createdAt: serverTimestamp() }),
    updatedAt: serverTimestamp(),
  };
}
