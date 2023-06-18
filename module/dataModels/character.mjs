export class CharacterData extends foundry.abstract.TypeDataModel {
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

function resource(complement) {
  return new fields.SchemaField({
    value: new fields.NumberField({
      required: true,
      initial: 10,
      integer: true,
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
    }),

    // hmmmmm now to delete these for null complement....
    complement: new fields.StringField({
      required: true,
      intial: complement,
    }),
    multiplier: new fields.NumberField({
      required: true,
      initial: 5,
      integer: true,
    })
  });
}

function ability(type) {
  return new fields.SchemaField({
    value: new fields.NumberField({}),
    type: new fields.StringField({
      initial: type
    }),
    notes: new fields.StringField({}),
  })
}

export class BaseCharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { fields } = foundry.data;
    
    return {
      resources: new fields.SchemaField({
        health: resource('end'),
        aether: resource('aet'),
        action: resource(null),
      }),
      abilities: new fields.SChemaField({
        str: ability('physical'),
        end: ability('physical'),
        agi: ability('physical'),
        alt: ability('phsyical'), 
        mel: ability('physical'),
        acc: ability('physical'),
        int: ability('mental'),
        res: ability('mental'),
        emp: ability('mental'),
        aet: ability('mental'),
      }),

      biography: new fields.HTMLField(),
      diety: new fields.StringField(),
      injuries: new fields.SchemaField({
        value: new fields.NumberField({
          initial: 0,
          required: true,
          integer: true,
        })
      }),
      permanentInjuries: new fields.SchemaField({
        value: new field.NumberField({
          initial: 0,
          required: true,
          integer: true,
        }),
        max: new field.NumberField({
          intial: 0,
          required: true,
          integer: true,
        })
      }),
      xp: new field.NumberField({
        iniial: 0,
        required: true,
        integer: true,
      }),
      mulligan: new field.StringField(),
      dietyGift: new field.StringField(),
      money: new field.NumberField(),
    }
  }
}

export class DerivedCharacterData extends BaseCharacterData {
  static defineSchemea() {
    const parented = super.defineSchema();

    // add more fields here
    return parented;
  }
}
