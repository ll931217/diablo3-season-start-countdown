<template>
  <h1>Diablo 3 Season {{ seasonNumber }}</h1>
  <h1 id="season-start">Season Start: {{ chosenTime }}</h1>
  <label for="timezones">Choose a region:</label>
  <select name="timezones" id="timezones" v-model="chosenZone">
    <option value="America/Los_Angeles">
      North America(PC, Consoles): Los Angeles
    </option>
    <option value="Europe/Brussels">Europe(PC): Brussels</option>
    <option value="Asia/Seoul">Asia(PC): Seoul</option>
  </select>
  <div id="current-time">
    <h1>Now:</h1>
    <ul>
      <li v-for="[key, now] in nowTimes" :key="key">
        {{ key.toUpperCase() }}: {{ now }}
      </li>
    </ul>
  </div>
  <div id="difference">
    <h1>Countdown:</h1>
    <ul>
      <li
        v-for="([abbr, zone], key) in Object.entries(timezones)"
        :id="zone"
        :key="key"
      >
        {{ abbr.toUpperCase() }}: {{ difference[abbr].days }} days,
        {{ difference[abbr].hours }}:{{ difference[abbr].minutes }}:{{
          difference[abbr].seconds
        }}
      </li>
    </ul>
  </div>
  <h4>Your Timezone: {{ myZone }}</h4>
</template>

<script>
import moment from "moment-timezone";
import { ref } from "vue";

const seasonStr = "2020-11-20 17:00";

const timezones = {
  pst: "America/Los_Angeles",
  kst: "Asia/Seoul",
  cet: "Europe/Brussels",
};

export default {
  name: "App",
  data: () => ({
    chosenZone: Object.values(timezones)[0],
    chosenTime: "",
    seasonNumber: 22,
    timezones,
  }),
  computed: {
    timezonesFormatted() {
      const obj = [];

      Object.entries(this.timezones).forEach(([key, value]) => {});

      return obj;
    },
    seasonTimes() {
      return Object.entries(this.season).map(([key, value]) => {
        return [
          key,
          moment(new Date(value))
            .tz(timezones[key])
            .format("ddd, D MMM YYYY, HH:mm:ss"),
        ];
      });
    },
    nowTimes() {
      return Object.entries(this.now).map(([key, value]) => {
        return [
          key,
          moment(new Date(value))
            .tz(timezones[key])
            .format("ddd, D MMM YYYY, HH:mm:ss"),
        ];
      });
    },
  },
  watch: {
    chosenZone: {
      handler(val) {
        this.chosenTime = moment(moment.tz(seasonStr, val).toDate())
          .local()
          .format("MMMM Do YYYY hh:mm a");
      },
      immediate: true,
    },
  },
  setup() {
    const season = ref(
      Object.fromEntries(
        Object.entries(timezones).map(([key, value]) => {
          return [key, moment.tz(seasonStr, value)];
        })
      )
    );

    const now = ref(
      Object.fromEntries(
        Object.entries(timezones).map(([key, value]) => {
          return [key, moment(new Date()).tz(value)];
        })
      )
    );

    const difference = ref(diff(season, now));
    setInterval(() => {
      Object.entries(timezones).forEach(([key, value]) => {
        now.value[key] = moment(new Date()).tz(value);
      });
      difference.value = diff(season, now);
    }, 1000);

    return {
      zones: moment.tz.names(),
      myZone: moment.tz.guess(),
      season,
      now,
      difference,
    };
  },
};

function diff(season, now) {
  return Object.fromEntries(
    Object.entries(timezones).map(([key, value]) => {
      const duration = moment.duration(
        season.value[key].toDate().getTime() -
          now.value[key].toDate().getTime(),
        "milliseconds"
      );

      return [
        key,
        {
          days: duration.days(),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
        },
      ];
    })
  );
}
</script>

<style lang="scss">
* {
  font-family: "Nunito", sans-serif;
}

html,
body {
  background: url("./assets/bg.jpg") #2f3640;
  color: #f5f6fa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

label {
  margin-right: 0.25rem;
}

select {
  background-color: #353b48;
  border: 1px solid #718093;
  border-radius: 4px;
  box-shadow: inset -1px -1px 3px 0 #000;
  color: #f5f6fa;
  padding: 0.2rem 0.25rem;
}
</style>
