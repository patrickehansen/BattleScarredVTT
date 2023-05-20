<template>
  <Tab group="primary" :tab="tab">
    <section class="grid grid-3col">
      <aside class="sidebar">

        <div class="abilities flexcol">
          <div v-for="(ability, key) in context.system.abilities.physical" :key="'system.abilities.physical.' + key + '.value'" :data-key="key" class="ability flexrow flex-group-center">
            <label @click="onRollable" :for="'system.abilities.physical.' + key + '.value'" class="ability-label physicalLabel resource-label rollable flexlarge align-left" :data-roll="'3d6-@abilities.physical.' + key + '.mod'" :data-label="ability.label">{{ability.label}}</label>
            <input type="text" :name="'system.abilities.' + key + '.value'" v-model="ability.value" data-dtype="Number"/>
            <span class="ability-mod rollable" :data-roll="'3d6-@abilities.physical.' + key + '.mod'" :data-label="ability.label">{{numberFormat(ability.mod, 0, true)}}</span>
          </div>
          <div v-for="(ability, key) in context.system.abilities.mental" :key="'system.abilities.mental.' + key + '.value'" :data-key="key" class="ability flexrow flex-group-center">
            <label @click="onRollable" :for="'system.abilities.mental.' + key + '.value'" class="ability-label mentalLabel resource-label rollable flexlarge align-left" :data-roll="'3d6-@abilities.mental.' + key + '.mod'" :data-label="ability.label">{{ability.label}}</label>
            <input type="text" :name="'system.abilities.' + key + '.value'" v-model="ability.value" data-dtype="Number"/>
            <span class="ability-mod rollable" :data-roll="'3d6-@abilities.mental.' + key + '.mod'" :data-label="ability.label">{{numberFormat(ability.mod, 0, true)}}</span>
          </div>
        </div>
      </aside>

      <section class="main grid-span-2">
        <ActorFeatures :context="context" :actor="actor"/>
      </section>

    </section>
  </Tab>
</template>

<script>
import { default as ActorFeatures } from '../parts/ActorFeatures.vue';
import { default as Tab } from '../parts/Tab.vue';
import { onRollable } from '../methods/Events.mjs';
import { numberFormat } from '../methods/Helpers.mjs';
export default {
  setup({context}) {
    return {
      context,
      onRollable,
      numberFormat
    }
  },
  name: 'Features',
  props: ['context', 'actor', 'tab'],
  components: {
    ActorFeatures,
    Tab
  },
  data() {
    return this.context;
  },
  computed: {
    
  },
}
</script>

<style scoped>

</style>