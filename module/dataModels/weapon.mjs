import { CarryableData } from "./carryable.mjs";

export class WeaponData extends CarryableData {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      biography: new fields.HTMLField(),
      health: new fields.SchemaField({
        value: new fields.NumberField({
          required: true,
          initial: 10,
          integer: true
        }),
        min: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        max: new fields.NumberField({
          required: true,
          initial: 10,
          integer: true
        })
      }),
      proficiencies: new fields.SchemaField({
        weapons: new fields.ArrayField(new fields.StringField()),
        skills: new fields.ArrayField(new fields.StringField())
      })
    };
  }
}

