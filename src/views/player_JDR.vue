
<template>
  <div class="tabs-container">

    <!-- Onglets -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Volet -->
    <div class="tab-content">

      <div v-if="activeTab === 'general'">
        <div class="pres_div">
            <p>Nom du personnage:</p>
            <p>{{ name }}</p>
        </div>
        <div class="pres_div">
            <p>classe:</p>
            <p>{{ classe }}</p>
        </div>
        <div class="pres_div">
            <p>sous-classe:</p>
            <p>{{ sous_classe }}</p>
        </div>
        <div class="pres_div">
            <p>espèce:</p>
            <p>{{ espece }}</p>
        </div>
        <div class="pres_div">
            <p>niveaux:</p>
            <p>{{ niveau }}</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'stats'">
        <h2>Caractéristiques</h2>
        <p>Force, Dextérité, Constitution, Intelligence...</p>
      </div>

      <div v-else-if="activeTab === 'inventory'">
        <h2>Inventaire</h2>
        <p>Épée, armure, potions...</p>
      </div>

      <div v-else-if="activeTab === 'spells'">
        <h2>Sorts</h2>
        <p>Liste des sorts du personnage...</p>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'CharacterTabs',

  data() {
    return {
      activeTab: 'general',
      name: "Yûki",
      classe: "Nécromancien",
      sous_classe: "",
      espece: "Elfe",
      niveau: 0,

      tabs: [
        {
          id: 'general',
          label: 'Général'
        },
        {
          id: 'stats',
          label: 'Caractéristiques'
        },
        {
          id: 'inventory',
          label: 'Inventaire'
        },
        {
          id: 'spells',
          label: 'Sorts'
        }
      ]
    }
  }
}
</script>

<style scoped>
.pres_div{
    display: flex;
    flex-direction: row;
}
.tabs-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 5px;
  border-bottom: 2px solid #ddd;
}

.tab {
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab:hover {
  color: #000;
}

.tab.active {
  color: #7c3aed;
  border-bottom-color: #7c3aed;
}

.tab-content {
  padding: 25px;
  border: 1px solid #ddd;
  border-top: none;
  min-height: 250px;
  background: white;
  height: 100%;
  width: 100%;
}
</style>