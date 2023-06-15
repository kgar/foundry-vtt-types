// FOUNDRY_VERSION: 10.291

import type Document from "../abstract/document.mjs";
import type { DocumentMetadata } from "../abstract/document.mjs";
import type { TextureData } from "../data/data.mjs/index.js";
import type * as fields from "../data/fields.mjs";
import type { CONST } from "../module.mjs.js";
import type * as documents from "./module.mjs";

declare global {
  type NoteData = BaseNote.Properties;
}

/**
 * The Document definition for a Note.
 * Defines the DataSchema and common behaviors for a Note which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseNote extends BaseNote.Properties {}
declare class BaseNote extends Document<BaseNote.SchemaField, BaseNote.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Note
   * @param context - Construction context options
   */
  constructor(data?: BaseNote.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseNote.Metadata>;

  static override defineSchema(): BaseNote.Schema;

  /**
   * The default icon used for newly created Note documents.
   * @defaultValue `"icons/svg/book.svg"`
   */
  static DEFAULT_ICON: string;

  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    {
      exact
    }?: {
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact?: boolean;
    }
  ): boolean;

  static override migrateData(source: object): object;

  static override shimData(
    data: object,
    {
      embedded
    }?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    }
  ): object;
}
export default BaseNote;

declare namespace BaseNote {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Note";
      collection: "notes";
      label: "DOCUMENT.Note";
      labelPlural: "DOCUMENT.Notes";
      permissions: {
        create: "NOTE_CREATE";
      };
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseNote embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of a JournalEntry document which this Note represents
     * @defaultValue `null`
     */
    entryId: fields.ForeignDocumentField<typeof documents.BaseJournalEntry, { idOnly: true }>;

    /**
     * The _id of a specific JournalEntryPage document which this Note represents
     * @defaultValue `null`
     */
    pageId: fields.ForeignDocumentField<typeof documents.BaseJournalEntryPage, { idOnly: true }>;

    /**
     * The x-coordinate position of the center of the note icon
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

    /**
     * The y-coordinate position of the center of the note icon
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

    /**
     * An image icon used to represent this note
     * @defaultValue `BaseNote.DEFAULT_ICON`
     */
    texture: TextureData<
      {},
      { categories: ["IMAGE"]; initial: () => typeof BaseNote.DEFAULT_ICON; label: "NOTE.EntryIcon" }
    >;

    /**
     * The pixel size of the map note icon
     * @defaultValue `40`
     */
    iconSize: fields.NumberField<{
      required: true;
      integer: true;
      min: 32;
      initial: 40;
      validationError: "must be an integer greater than 32";
      label: "NOTE.IconSize";
    }>;

    /**
     * Optional text which overrides the title of the linked Journal Entry
     * @defaultValue `""`
     */
    text: fields.StringField<{ label: "NOTE.TextLabel" }>;

    /**
     * The font family used to display the text label on this note, defaults to CONFIG.defaultFontFamily
     * @defaultValue `globalThis.CONFIG?.defaultFontFamily || "Signika"`
     */
    fontFamily: fields.StringField<{ required: true; label: "NOTE.FontFamily"; initial: () => string }>;

    /**
     * The font size used to display the text label on this note
     * @defaultValue `32`
     */
    fontSize: fields.NumberField<{
      required: true;
      integer: true;
      min: 8;
      max: 128;
      initial: 32;
      validationError: "must be an integer between 8 and 128";
      label: "NOTE.FontSize";
    }>;

    /**
     * A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors to the note icon.
     * @defaultValue `CONST.TEXT_ANCHOR_POINTS.BOTTOM`
     */
    textAnchor: fields.NumberField<{
      required: true;
      choices: CONST.TEXT_ANCHOR_POINTS[];
      initial: typeof CONST.TEXT_ANCHOR_POINTS.BOTTOM;
      label: "NOTE.AnchorPoint";
      validationError: "must be a value in CONST.TEXT_ANCHOR_POINTS";
    }>;

    /**
     * The string that defines the color with which the note text is rendered
     * @defaultValue `#FFFFFF`
     */
    textColor: fields.ColorField<{ initial: "#FFFFFF"; label: "NOTE.TextColor" }>;

    /**
     * Whether this map pin is globally visible or requires LoS to see.
     * @defaultValue `false`
     */
    global: fields.BooleanField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Note">;
  }
}