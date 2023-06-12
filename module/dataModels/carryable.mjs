
export class CarryableData extends foundry.abstract.TypeDataModel {
  defineSchema() {
    const fields = foundry.data.fields;

    return {
      weight: new fields.NumberField({
        intial: 0,
        required: true,
        integer: true,
      })
    }
  }
}