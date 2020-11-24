<template>
  <h1>Diablo 3 Season {{ seasonNumber }}</h1>
  <h4>Your Timezone: {{ myZone }}</h4>
  <label for="timezones">Choose a region:</label>
  <select name="timezones" id="timezones" v-model="chosenZone">
    <option value="America/Los_Angeles">
      North America(PC, Consoles): Los Angeles
    </option>
    <option value="Europe/Brussels">Europe(PC): Brussels</option>
    <option value="Asia/Seoul">Asia(PC): Seoul</option>
  </select>
  <h1 id="season-start">Season Start: {{ chosenTime }}</h1>
  <div class="countdown">
    <div
      class="card"
      v-for="([key, value], i) in Object.entries(countdown)"
      :key="i"
    >
      {{ addZero(value) }}
      <span>{{ key }}</span>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import { ref } from "vue";

import { addZero, diff, seasonStr, timezones } from "./utils.js";

export default {
  name: "App",
  data: () => ({
    chosenZone: Object.values(timezones)[0],
    chosenTime: "",
    seasonNumber: 22,
    timezones,
  }),
  watch: {
    chosenZone(val) {
      localStorage.setItem("chosenZone", val);

      this.chosenKey = Object.keys(timezones).find(
        (key) => timezones[key] === val
      );

      this.chosenTime = moment(moment.tz(seasonStr, val).toDate())
        .local()
        .format("MMMM Do YYYY hh:mm a");
    },
  },
  mounted() {
    if (localStorage.getItem("chosenZone")) {
      this.chosenZone = localStorage.getItem("chosenZone");
    }
  },
  methods: {
    addZero,
  },
  setup() {
    const countdown = ref({});
    const chosenKey = ref("pst");

    const season = ref(
      Object.fromEntries(
        Object.entries(timezones).map(([key, value]) => [
          key,
          moment.tz(seasonStr, value),
        ])
      )
    );

    const now = ref(
      Object.fromEntries(
        Object.entries(timezones).map(([key, value]) => [
          key,
          moment(new Date()).tz(value),
        ])
      )
    );

    const difference = ref(diff(season, now));

    setInterval(() => {
      Object.entries(timezones).forEach(([key, value]) => {
        now.value[key] = moment(new Date()).tz(value);
      });
      difference.value = diff(season, now);

      if (difference.value[chosenKey.value]) {
        const d = difference.value[chosenKey.value];
        // countdown.value = `${pluralize("day", d.days)}, ${pluralize(
        //   "hour",
        //   d.hours
        // )} ${pluralize("minute", d.minutes)} ${pluralize("second", d.seconds)}`;
        countdown.value = d;
      }
    }, 1000);

    return {
      zones: moment.tz.names(),
      myZone: moment.tz.guess(),
      countdown,
      chosenKey,
    };
  },
};
</script>

<style lang='scss'>
$season-bg: "https://pbs.twimg.com/media/EmKTckKXYAAVa5L?format=jpg&name=medium";

@font-face {
  font-family: "Exocet Reaper";
  src: url("./assets/fonts/exocet_reaper.eot");
  src: url("./assets/fonts/exocet_reaper.eot?#iefix")
      format("embedded-opentype"),
    url("./assets/fonts/exocet_reaper.woff") format("woff"),
    url("./assets/fonts/exocet_reaper.ttf") format("truetype"),
    url("./assets/fonts/exocet_reaper.svg#svgFontName") format("svg");
}

html,
body {
  background: url($season-bg);
  background-size: cover;
  color: #f5f6fa;
  display: flex;
  font-family: "Exocet Reaper Medium", "Nunito", sans-serif;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  #app {
    margin: 0 3em;

    label {
      margin-right: 0.25rem;
    }

    .countdown {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));

      .card {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        font-size: 3rem;
        text-align: center;
        margin: 0.25rem;
        padding: 0.5rem;

        span {
          font-size: 1.25rem;
        }
      }
    }

    select {
      background-color: #353b48;
      border: 1px solid #718093;
      border-radius: 4px;
      box-shadow: inset -1px -1px 3px 0 #000;
      color: #f5f6fa;
      padding: 0.2rem 0.25rem;
    }
  }
}
</style>
