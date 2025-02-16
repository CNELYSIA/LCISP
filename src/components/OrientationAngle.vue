<template>
  <div style="position: relative;height: 20vh;;">
    <canvas ref="angleCanvas" style="width: 100%; height: 100%;" ></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const props = defineProps({
  Data: {
    type: String,
    required: true
  },

})
const angleCanvas = ref(null);
const orientationAngle = props.Data;

onMounted(() => {
  const canvas = angleCanvas.value;
  const ctx = canvas.getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set up center and radius for the circle
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;

  // Draw a circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#ccc';
  ctx.stroke();

  // Calculate arrow coordinates based on the orientation angle
  const endX = centerX + radius * Math.cos(orientationAngle);
  const endY = centerY + radius * Math.sin(orientationAngle);

  // Draw the line (arrow body)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'blue';
  ctx.stroke();

  // Draw the arrowhead
  drawArrowhead(ctx, endX, endY, orientationAngle);

});

function drawArrowhead(context, x, y, angle) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(-10, -5);
  context.lineTo(-10, 5);
  context.closePath();
  context.fillStyle = 'blue';
  context.fill();
  context.restore();
}
</script>

<style scoped>
/* Add any necessary styles here */
</style>



