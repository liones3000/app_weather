<script>
import { Line } from "vue-chartjs";
export default {
  extends: Line,
  props: {
    isRender: {
      type: Boolean,
      default: false
    },
    chartData: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    isRender: "render"
  },
  methods: {
    render(value) {
      if (value) {
        this.renderChart(this.chartData, this.options);
      }
    }
  }
};
</script>
