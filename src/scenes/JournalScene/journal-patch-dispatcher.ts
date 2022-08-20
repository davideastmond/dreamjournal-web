import { patchJournalAttribute } from "../../services/journal/journal.service";

export enum EJournalPatcherField {
  JournalTitle = "title",
  JournalDescription = "description",
  JournalTags = "tags",
}

export class JournalPatcher {
  private journalId: string;
  constructor({ journalId }: { journalId: string }) {
    this.journalId = journalId;
  }

  public async patch({
    data,
    field,
  }: {
    data: string;
    field: EJournalPatcherField;
  }): Promise<void> {
    const action = this.getAction({ data, field });
    const patchObject = {
      [`${field}`]: {
        action,
        data:
          field === EJournalPatcherField.JournalTags
            ? this.getTagData({ data })
            : data,
      },
    };
    await patchJournalAttribute({
      journalId: this.journalId,
      patchObject,
    });
  }

  private getAction({
    data,
    field,
  }: {
    data: string;
    field: EJournalPatcherField | string;
  }): "delete" | "update" {
    if (
      field === EJournalPatcherField.JournalTitle ||
      field === EJournalPatcherField.JournalDescription
    ) {
      return data && data.trim() !== "" ? "update" : "delete";
    }
    return data.trim() === "" ? "delete" : "update";
  }

  private getTagData({ data }: { data: string }): string[] {
    if (data.trim() === "") return [];

    const parsedTags = data.split(",");
    return parsedTags.map((tag) => tag.trim());
  }
}
