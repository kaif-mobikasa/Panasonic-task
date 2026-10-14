/**
 * Custom Footer Script - Panasonic Theme
 * Handles:
 * 1. 3D Procedural Rotating Globe Horizon Canvas & SVG Orbits
 * 2. Mobile accordion collapse/expand with accessible ARIA states
 * 3. Shopify theme customizer lifecycle events
 */

(function () {
  'use strict';

  function isReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  // TopoJSON land mask cache shared across footer instances
  let landMaskPromise = null;

  function getLandMask() {
    if (landMaskPromise) return landMaskPromise;

    // Async fetch of TopoJSON 110m land polygon vector data
    landMaskPromise = fetch(
      'data:application/json;base64,eyJ0eXBlIjoiVG9wb2xvZ3kiLCJvYmplY3RzIjp7ImxhbmQiOnsidHlwZSI6Ikdlb21ldHJ5Q29sbGVjdGlvbiIsImdlb21ldHJpZXMiOlt7InR5cGUiOiJNdWx0aVBvbHlnb24iLCJhcmNzIjpbW1swXV0sW1sxXV0sW1syXV0sW1szXV0sW1s0XV0sW1s1XV0sW1s2XV0sW1s3XV0sW1s4XV0sW1s5XV0sW1sxMF1dLFtbMTFdXSxbWzEyXV0sW1sxM11dLFtbMTRdXSxbWzE1XV0sW1sxNiwxOF1dLFtbMTldXSxbWzIwXV0sW1syMV1dLFtbMjJdXSxbWzIzXV0sW1syNF1dLFtbMjVdXSxbWzI2XV0sW1syN11dLFtbMjhdXSxbWzI5XV0sW1szMF1dLFtbMzFdXSxbWzMyXV0sW1szM11dLFtbMzRdXSxbWzM1XV0sW1szNl1dLFtbMzddXSxbWzM4XV0sW1szOV1dLFtbNDBdXSxbWzQxXV0sW1s0Ml1dLFtbNDNdXSxbWzQ0XV0sW1s0NV1dLFtbNDZdXSxbWzQ3XV0sW1s0OF1dLFtbNDldXSxbWzUwXV0sW1s1MV1dLFtbNTJdXSxbWzUzXV0sW1s1NF1dLFtbNTVdXSxbWzU2XV0sW1s1N11dLFtbNThdXSxbWzU5XV0sW1s2MF1dLFtbNjFdXSxbWzYyXV0sW1s2M11dLFtbNjRdXSxbWzY1XV0sW1s2Nl1dLFtbNjddXSxbWzY4XV0sW1s2OV1dLFtbNzBdXSxbWzcxXV0sW1s3Ml1dLFtbNzNdXSxbWzc0XV0sW1s3NV1dLFtbNzZdXSxbWzc3XV0sW1s3OF1dLFtbNzldXSxbWzgwXV0sW1s4MV1dLFtbODJdXSxbWzgzXV0sW1s4NF1dLFtbODVdXSxbWzg2XV0sW1s4N11dLFtbODhdXSxbWzg5XV0sW1s5MF1dLFtbOTFdXSxbWzkyLDExNV0sWzExNF1dLFtbOTRdXSxbWzk1XV0sW1s5Nl1dLFtbOTddXSxbWzk4XV0sW1s5OV1dLFtbMTAwXV0sW1sxMDFdXSxbWzEwMl1dLFtbMTAzXV0sW1sxMDRdXSxbWzEwNV1dLFtbMTA2XV0sW1sxMDddXSxbWzEwOF1dLFtbMTA5XV0sW1sxMTBdXSxbWzExMV1dLFtbMTEyXV0sW1sxMTNdXSxbWzExNl1dLFtbMTE3XV0sW1sxMThdXSxbWzExOV1dLFtbMTIwXV0sW1sxMjFdXSxbWzEyMl1dLFtbMTIzXV0sW1sxMjRdXSxbWzEyNV1dLFtbMTI2XV0sW1sxMjddXSxbWzEyOF1dLFtbMTI5XV1dfV19fSwiYXJjcyI6W1tbMzM0NTIsMzI5MF0sWy04MiwtMzAxXSxbLTgxLC0yNjZdLFstNTgyLDgxXSxbLTYyMSwtMzVdLFstMzQ4LDE5N10sWzAsMjNdLFstMTUyLDE3NF0sWzYyNSwtMjNdLFs1OTksLTU4XSxbMjA3LDI0M10sWzE0NywyMDhdLFsyODgsLTI0M11dLFtbNTc3NSwzNjExXSxbLTUzMywtODFdLFstMzY0LDIwOF0sWy0xNjMsMjA5XSxbLTExLDM1XSxbLTE4MCwxNjJdLFsxNjksMjIwXSxbNTE3LC05M10sWzI3NywtMTg1XSxbMjEyLC0yMDldLFs3NiwtMjY2XV0sW1szNzQ1Nyw0NDY4XSxbMzQyLC0yNTVdLFsxMjAsLTM1OV0sWzMzLC0yNTRdLFsxMSwtMzAxXSxbLTQzMCwtMTg2XSxbLTQ1MiwtMTUwXSxbLTUyMiwtMTM5XSxbLTU4MiwtMTE2XSxbLTY1OCwzNV0sWy0zNjUsMTk3XSxbNDksMjQzXSxbNTkzLDE2Ml0sWzIzOSwxOTddLFsxNzQsMjU0XSxbMTI2LDIyMF0sWzE2OCwyMDldLFsxODAsMjQzXSxbMTQxLDBdLFs0MTQsMTI3XSxbNDE5LC0xMjddXSxbWzE2MzMwLDcxNTRdLFszNTksLTkzXSxbMzMyLDEwNF0sWy0xNTgsLTIwOF0sWy0yNjEsLTE1MV0sWy0zODYsNDddLFstMjc4LDIwOF0sWzYwLDE5N10sWzMzMiwtMTA0XV0sW1sxNTEyMiw3MTY1XSxbNDI1LC0yMzFdLFstMTY0LDIzXSxbLTM1OSw1OF0sWy0zODEsMTYyXSxbMjAyLDEyN10sWzI3NywtMTM5XV0sW1syMjUwNSw4MDgwXSxbMzA1LC04MV0sWzMwNCw2OV0sWzE2MywtMzM1XSxbLTIxNyw0Nl0sWy0zMzcsLTIzXSxbLTM0MywyM10sWy0zNzYsLTM1XSxbLTI4MywxMTZdLFstMTQ2LDI0M10sWzE3NCwxMDRdLFszNTMsLTgxXSxbNDAzLC00Nl1dLFtbMzA5ODUsODY1N10sWzMzLC0yNjZdLFstNDksLTIzMV0sWy03NiwtMjIwXSxbLTMyNiwtODFdLFstMzExLC0xMTZdLFstMzY0LDExXSxbMTM2LDIzMl0sWy0zMjcsLTgxXSxbLTMxMCwtODFdLFstMjEyLDE3NF0sWy0xNiwyNDNdLFszMDUsMjMxXSxbMTkwLDcwXSxbMzIxLC0yM10sWzgyLDMwMV0sWzE2LDIxOV0sWy02LDQ3NV0sWzE1OCwyNzhdLFsyNTYsOTNdLFsxNDcsLTIyMF0sWzY1LC0yMjBdLFsxMjAsLTI2N10sWzkyLC0yNTRdLFs3NiwtMjY3XV0sW1swLDUyOV0sWzE2LC01XSxbMjQ1LDM0NF0sWzUwMSwtMTg1XSxbMzIsMjFdLFs3OCw0OV0sWzk0LDYxXSxbODEsNTJdLFs0MSwyNl0sWzQxLC0xXSxbMjksLTEwXSxbNDAyLC0yNDZdLFszNTIsMjQ2XSxbNjMsMzRdLFs4MTYsMTA0XSxbMjY1LC0xMzhdLFsxMzAsLTcxXSxbNDE5LC0xOTZdLFs3ODksLTE1MV0sWzYyNSwtMTg1XSxbMTA3MiwtMTM5XSxbODAwLDE2Ml0sWzExODEsLTExNl0sWzY2OSwtMTg1XSxbNzM0LDE3NF0sWzc3MywxNjJdLFs2MCwyNzhdLFstMTA5NCwyM10sWy04OTgsMTM5XSxbLTIzNCwyMzFdLFstNzQ1LDEyOF0sWzQ5LDI2Nl0sWzEwMywyNDNdLFsxMDQsMjIwXSxbLTU1LDI0M10sWy00NjIsMTYyXSxbLTIxMiwyMDldLFstNDMwLDE4NV0sWzY3NSwtMzVdLFs2NDIsOTNdLFs0MDIsLTE5N10sWzQ5NSwxNzNdLFs0NTcsMjIwXSxbMjIzLDE5N10sWy05OCwyNDNdLFstMzU5LDE2Ml0sWy00MDgsMTc0XSxbLTU3MSwzNV0sWy01MDAsODFdLFstNTM5LDU4XSxbLTE4MCwyMjBdLFstMzU5LDE4NV0sWy0yMTcsMjA4XSxbLTg3LDY3Ml0sWzEzNiwtNThdLFsyNTAsLTE4NV0sWzQ1Nyw1OF0sWzQ0MSw4MV0sWzIyOCwtMjU1XSxbNDQxLDU4XSxbMzcwLDEyN10sWzM0OCwxNjJdLFszMTUsMTk3XSxbNDE5LDU4XSxbLTExLDIyMF0sWy05NywyMjBdLFs4MSwyMDhdLFszNTksMTA0XSxbMTYzLC0xOTZdLFs0MjUsMTE1XSxbMzIxLDE1MV0sWzM5NywxMl0sWzM3NSw1N10sWzM3NiwxMzldLFsyOTksMTI4XSxbMzM3LDEyN10sWzIxOCwtMzVdLFsxOTAsLTQ2XSxbNDE0LDgxXSxbMzcwLC0xMDRdLFszODEsMTFdLFszNjQsODFdLFszNzUsLTU3XSxbNDE0LC01OF0sWzM4NiwyM10sWzQwMywtMTJdLFs0MTMsLTExXSxbMzgxLDIzXSxbMjgzLDE3NF0sWzMzNyw5Ml0sWzM0OSwtMTI3XSxbMzMxLDEwNF0sWzMwMCwyMDhdLFsxNzksLTE4NV0sWzk4LC0yMDhdLFsxODAsLTE5N10sWzI4OCwxNzRdLFszMzIsLTIyMF0sWzM3NSwtNzBdLFszMjEsLTE2Ml0sWzM5MiwzNV0sWzM1NCwxMDRdLFs0MTgsLTIzXSxbMzc2LC04MV0sWzM4MSwtMTA0XSxbMTQ3LDI1NF0sWy0xODAsMTk3XSxbLTEzNiwyMDldLFstMzU5LDQ2XSxbLTE1OCwyMjBdLFstNjAsMjIwXSxbLTk4LDQ0MF0sWzIxMywtODFdLFszNjQsLTM1XSxbMzU5LDM1XSxbMzI3LC05M10sWzI4MywtMTc0XSxbMTE5LC0yMDhdLFszNzYsLTM1XSxbMzU5LDgxXSxbMzgxLDExNl0sWzM0Miw3MF0sWzI4MywtMTM5XSxbMzcwLDQ2XSxbMjM5LDQ1MV0sWzIyNCwtMjY2XSxbMzIxLC0xMDRdLFszNDgsNThdLFsyMjgsLTIzMl0sWzM2NSwtMjNdLFszMzcsLTY5XSxbMzMyLC0xMjhdLFsyMTgsMjIwXSxbMTA4LDIwOV0sWzI3OCwtMjMyXSxbMzgxLDU4XSxbMjgzLC0xMjddLFsxOTAsLTE5N10sWzM3MCw1OF0sWzI4OCwxMjddLFsyODMsMTUxXSxbMzM3LDgxXSxbMzkyLDY5XSxbMzU0LDgxXSxbMjcyLDEyN10sWzE2MywxODZdLFs2NSwyNTRdLFstMzIsMjQ0XSxbLTg3LDIzMV0sWy05OCwyMzJdLFstODcsMjMxXSxbLTcxLDIwOV0sWy0xNiwyMzFdLFsyNywyMzJdLFsxMzAsMjIwXSxbMTA5LDI0M10sWzQ0LDIzMV0sWy01NSwyNTVdLFstMzIsMjMyXSxbMTM2LDI2Nl0sWzE1MiwxNzNdLFsxODAsMjIwXSxbMTkwLDE4Nl0sWzIyMywxNzNdLFsxMDksMjU1XSxbMTUyLDE2Ml0sWzE3NCwxNTFdLFsyNjcsMzRdLFsxNzQsMTg2XSxbMTk2LDExNV0sWzIyOCw3MF0sWzIwMiwxNTBdLFsxNTcsMTg2XSxbMjE4LDY5XSxbMTYzLC0xNTFdLFstMTAzLC0xOTZdLFstMjgzLC0xNzRdLFstMTIwLC0xMjddLFstMjA2LDkyXSxbLTIyOSwtNThdLFstMTkwLC0xMzldLFstMjAyLC0xNTBdLFstMTM2LC0xNzRdLFstMzgsLTIzMV0sWzE3LC0yMjBdLFsxMzAsLTE5N10sWy0xOTAsLTEzOV0sWy0yNjEsLTQ2XSxbLTE1MywtMTk3XSxbLTE2MywtMTg1XSxbLTE3NCwtMjU1XSxbLTQ0LC0yMjBdLFs5OCwtMjQzXSxbMTQ3LC0xODVdLFsyMjksLTEzOV0sWzIxMiwtMTg1XSxbMTE0LC0yMzJdLFs2MCwtMjIwXSxbODIsLTIzMl0sWzEzMCwtMTk2XSxbODIsLTIyMF0sWzM4LC01NDRdLFs4MSwtMjIwXSxbMjIsLTIzMl0sWzg3LC0yMzFdLFstMzgsLTMxM10sWy0xNTIsLTI0M10sWy0xNjMsLTE5N10sWy0zNzAsLTgxXSxbLTEyNSwtMjA4XSxbLTE2OSwtMTk3XSxbLTQxOSwtMjIwXSxbLTM3MCwtOTNdLFstMzQ4LC0xMjddLFstMzc2LC0xMjhdLFstMjIzLC0yNDNdLFstNDQ2LC0yM10sWy00ODksMjNdLFstNDQxLC00Nl0sWy00NjgsMF0sWzg3LC0yMzJdLFs0MjQsLTEwNF0sWzMxMSwtMTYyXSxbMTc0LC0yMDhdLFstMzEwLC0xODVdLFstNDc5LDU4XSxbLTM5NywtMTUxXSxbLTE3LC0yNDNdLFstMTEsLTIzMl0sWzMyNywtMTk2XSxbNjAsLTIyMF0sWzM1MywtMjIwXSxbNTg4LC05M10sWzUwMCwtMTYyXSxbMzk4LC0xODVdLFs1MDYsLTE4Nl0sWzY5MCwtOTJdLFs2ODEsLTE2Ml0sWzQ3MywtMTc0XSxbNTE3LC0xOTddLFsyNzIsLTI3OF0sWzEzNiwtMjIwXSxbMzM3LDIwOV0sWzQ1NywxNzNdLFs0ODQsMTg2XSxbNTc3LDE1MF0sWzQ5NSwxNjJdLFs2OTEsMTJdLFs2ODAsLTgxXSxbNTYwLC0xMzldLFsxODAsMjU1XSxbMzg2LDE3M10sWzcwMiwxMl0sWzU1MCwxMjddLFs1MjIsMTI4XSxbNTc3LDgxXSxbNjE0LDEwNF0sWzQzMCwxNTBdLFstMTk2LDIwOV0sWy0xMTksMjA4XSxbMCwyMjBdLFstNTM5LC0yM10sWy01NzEsLTkzXSxbLTU0NCwwXSxbLTc3LDIyMF0sWzM5LDQ0MF0sWzEyNSwxMjhdLFszOTcsMTM4XSxbNDY4LDEzOV0sWzMzNywxNzRdLFszMzcsMTc0XSxbMjUxLDIzMV0sWzM4MCwxMDRdLFszNzYsODFdLFsxOTAsNDddLFs0MzAsMjNdLFs0MDgsODFdLFszNDMsMTE2XSxbMzM3LDEzOV0sWzMwNSwxMzldLFszODYsMTg1XSxbMjQ1LDE5N10sWzI2MSwxNzNdLFs4MiwyMzJdLFstMjk0LDEzOV0sWzk4LDI0M10sWzE4NSwxODVdLFsyODgsMTE2XSxbMzA1LDEzOV0sWzI4MywxODVdLFsyMTcsMjMyXSxbMTM2LDI3N10sWzIwMiwxNjNdLFszMzEsLTM1XSxbMTM2LC0xOTddLFszMzIsLTIzXSxbMTEsMjIwXSxbMTQyLDIzMV0sWzI5OSwtNThdLFs3MSwtMjIwXSxbMzMxLC0zNF0sWzM2MCwxMDRdLFszNDgsNjldLFszMTUsLTM0XSxbMTIwLC0yNDNdLFszMDUsMTk2XSxbMjgzLDEwNV0sWzMxNSw4MV0sWzMxMCw4MV0sWzI4MywxMzldLFszMTAsOTJdLFsyNDAsMTI4XSxbMTY4LDIwOF0sWzIwNywtMTUxXSxbMjg4LDgxXSxbMjAyLC0yNzddLFsxNTcsLTIwOV0sWzMxNiwxMTZdLFsxMjUsMjMyXSxbMjgzLDE2Ml0sWzM2NSwtMzVdLFsxMDgsLTIyMF0sWzIyOSwyMjBdLFsyOTksNjldLFszMjYsMjNdLFsyOTQsLTExXSxbMzEwLC03MF0sWzMwMCwtMzRdLFsxMzAsLTE5N10sWzE4MCwtMTc0XSxbMzA0LDEwNF0sWzMyNywyNF0sWzMxNSwwXSxbMzEwLDExXSxbMjc4LDgxXSxbMjk0LDcwXSxbMjQ1LDE2Ml0sWzI2MSwxMDRdLFsyODMsNThdLFsyMTIsMTYyXSxbMTUyLDMyNF0sWzE1OCwxOTddLFsyODgsLTkzXSxbMTA5LC0yMDhdLFsyMzksLTEzOV0sWzI4OSw0Nl0sWzE5NiwtMjA4XSxbMjA2LC0xNTFdLFsyODMsMTM5XSxbOTgsMjU1XSxbMjUwLDEwNF0sWzI4OSwxOTddLFsyNzIsODFdLFszMjYsMTE2XSxbMjE4LDEyN10sWzIyOCwxMzldLFsyMTgsMTI3XSxbMjYxLC02OV0sWzI1MCwyMDhdLFsxODAsMTYyXSxbMjYxLC0xMV0sWzIyOSwxMzldLFs1NCwyMDhdLFsyMzQsMTYyXSxbMjI4LDExNl0sWzI3OCw5M10sWzI1Niw0Nl0sWzI0NCwtMzVdLFsyNjIsLTU4XSxbMjIzLC0xNjJdLFsyNywtMjU0XSxbMjQ1LC0xOTddLFsxNjgsLTE2Ml0sWzMzMiwtNzBdLFsxODUsLTE2Ml0sWzIyOSwtMTYyXSxbMjY2LC0zNV0sWzIyMywxMTZdLFsyNDAsMjQzXSxbMjYxLC0xMjddLFsyNzIsLTcwXSxbMjYxLC02OV0sWzI3MiwtNDZdLFsyNzcsMF0sWzIyOSwtNjE0XSxbLTExLC0xNTBdLFstMzMsLTI2N10sWy0yNjYsLTE1MF0sWy0yMTgsLTIyMF0sWzM4LC0yMzJdLFszMTAsMTJdLFstMzgsLTIzMl0sWy0xNDEsLTIyMF0sWy0xMzEsLTI0M10sWzIxMiwtMTg1XSxbMzIxLC01OF0sWzMyMSwxMDRdLFsxNTMsMjMyXSxbOTIsMjIwXSxbMTUzLDE4NV0sWzE3NCwxNzRdLFs3MCwyMDhdLFsxNDcsMjg5XSxbMTc0LDU4XSxbMzE2LDI0XSxbMjc3LDY5XSxbMjgzLDkzXSxbMTM2LDIzMV0sWzgyLDIyMF0sWzE5MCwyMjBdLFsyNzIsMTUxXSxbMjM0LDExNV0sWzE1MywxOTddLFsxNTcsMTA0XSxbMjAyLDkzXSxbMjc3LC01OF0sWzI1MCw1OF0sWzI3Miw2OV0sWzMwNSwtMzRdLFsyMDEsMTYyXSxbMTQyLDM5M10sWzEwMywtMTYyXSxbMTMxLC0yNzhdLFsyMzQsLTExNV0sWzI2NiwtNDddLFsyNjcsNzBdLFsyODMsLTQ2XSxbMjYxLC0xMl0sWzE3NCw1OF0sWzIzNCwtMzVdLFsyMTIsLTEyN10sWzI1MCw4MV0sWzMwMCwwXSxbMjU1LDgxXSxbMjg5LC04MV0sWzE4NSwxOTddLFsxNDEsMTk2XSxbMTkxLDE2M10sWzM0OCw0MzldLFsxNzksLTgxXSxbMjEyLC0xNjJdLFsxODUsLTIwOF0sWzM1NCwtMzU5XSxbMjcyLC0xMl0sWzI1NiwwXSxbMjk5LDcwXSxbMjk5LDgxXSxbMjI5LDE2Ml0sWzE5MCwxNzRdLFszMTAsMjNdLFsyMDcsMTI3XSxbMjE4LC0xMTZdLFsxNDEsLTE4NV0sWzE5NiwtMTg1XSxbMzA1LDIzXSxbMTkwLC0xNTBdLFszMzIsLTE1MV0sWzM0OCwtNThdLFsyODgsNDddLFsyMTgsMTg1XSxbMTg1LDE4NV0sWzI1MCw0Nl0sWzI1MSwtODFdLFsyODgsLTU4XSxbMjYxLDkzXSxbMjUwLDBdLFsyNDUsLTU4XSxbMjU2LC01OF0sWzI1MCwxMDRdLFsyOTksOTNdLFsyODMsMjNdLFszMTYsMF0sWzI1NSw1OF0sWzI1MSw0Nl0sWzc2LDI5MF0sWzExLDI0M10sWzE3NCwtMTYyXSxbNDksLTI2Nl0sWzkyLC0yNDRdLFsxMTUsLTE5Nl0sWzIzNCwtMTA1XSxbMzE1LDM1XSxbMzY1LDEyXSxbMjUwLDM1XSxbMzY0LDBdLFsyNjIsMTFdLFszNjQsLTIzXSxbMzEwLC00Nl0sWzE5NiwtMTg2XSxbLTU0LC0yMjBdLFsxNzksLTE3M10sWzI5OSwtMTM5XSxbMzEwLC0xNTFdLFszNjAsLTEwNF0sWzM3NSwtOTJdLFsyODMsLTkzXSxbMzE1LC0xMl0sWzE4MCwxOTddLFsyNDUsLTE2Ml0sWzIxMiwtMTg1XSxbMjQ1LC0xMzldLFszMzcsLTU4XSxbMzIxLC02OV0sWzEzNiwtMjMyXSxbMzE2LC0xMzldLFsyMTIsLTIwOF0sWzMxMCwtOTNdLFszMjEsMTJdLFsyOTksLTM1XSxbMzMyLDEyXSxbMzMyLC00N10sWzMxMCwtODFdLFsyODgsLTEzOV0sWzI4OSwtMTE2XSxbMTk1LC0xNzNdLFstMzIsLTIzMl0sWy0xNDcsLTIwOF0sWy0xMjUsLTI2Nl0sWy05OCwtMjA5XSxbLTEzMSwtMjQzXSxbLTM2NCwtOTNdLFstMTYzLC0yMDhdLFstMzYwLC0xMjddLFstMTI1LC0yMzJdLFstMTkwLC0yMjBdLFstMjAxLC0xODVdLFstMTE1LC0yNDNdLFstNzAsLTIyMF0sWy0yOCwtMjY2XSxbNiwtMjIwXSxbMTU4LC0yMzJdLFs2MCwtMjIwXSxbMTMwLC0yMDhdLFs1MTcsLTgxXSxbMTA5LC0yNTVdLFstNTAxLC05M10sWy00MjQsLTEyN10sWy01MjgsLTIzXSxbLTIzNCwtMzM2XSxbLTQ5LC0yNzhdLFstMTE5LC0yMjBdLFstMTQ3LC0yMjBdLFszNzAsLTE5Nl0sWzE0MSwtMjQ0XSxbMjM5LC0yMTldLFszMzgsLTE5N10sWzM4NiwtMTg2XSxbNDE5LC0xODVdLFs2MzYsLTE4NV0sWzE0MiwtMjg5XSxbODAwLC0xMjhdLFs1MywtNDVdLFsyMDgsLTE3NV0sWzc2NywxNTFdLFs2MzYsLTE4Nl0sWy05OTUyMCwtMTQyXV0sW1szMTE4MCwxODc2NF0sWzM2MSwtMzU1XSxbMzg5LC0xNDddLFstMTI1LC0yOTZdLFstMjY0LC0yOV0sWy0xNDEsMjA4XSxbLTkyLC0yMzldLFstMjM4LC0xODNdLFstMzAxLDY3XSxbLTIwMiwxNzddLFstMjkxLDg2XSxbLTM1MCwzMzBdLFstMjgzLDMxN10sWy0zODMsNjYyXSxbMjI5LC0xMjRdLFszOTAsLTM5NV0sWzM2OSwtMjEyXSxbMTQzLDI3MV0sWzkwLDQwNV0sWzI1NiwyNDRdLFsxOTgsLTcwXSxbMTA2LC0yNzRdLFsxMzksLTQ0M11dLFtbMzM3MzYsMjAzODldLFsyMjIsLTI2Nl0sWy04MywtMjA3XSxbLTM3NSwtMTc3XSxbLTEyNSwyMDddLFstMjM2LC0yNjZdLFstMTM5LDI2Nl0sWzMzMywzNTRdLFsyMzYsLTE0OF0sWzE2NywyMzddXSxbWzY5NTIyLDIxMjEwXSxbLTQyNywtMzhdLFstNywzMTRdLFs0MSwyNDRdLFsxOSwxMjFdLFsxNzksLTE4Nl0sWzI2MywtNzRdLFs5LC0xMTJdLFstNzcsLTI2OV1dLFtbOTAzODcsMjY0NzldLFsyNjksLTIwNF0sWzE1MSw4MV0sWzIxNywxMTNdLFsxNjYsLTM5XSxbMjAsLTcwMl0sWy05NSwtMjAzXSxbLTI5LC00NzZdLFstOTcsMTYyXSxbLTE5MywtNDEyXSxbLTU3LDMyXSxbLTE3MSwxOV0sWy0xNzEsNTA1XSxbLTM4LDM5MF0sWy0xNjAsNTE1XSxbNywyNzFdLFsxODEsLTUyXV0sW1s5ODA2MCwyNjQwNF0sWzYzLC0yNDRdLFsxOTgsMjM5XSxbODAsLTI0OV0sWzAsLTI0OV0sWy0xMDMsLTI3NF0sWy0xODIsLTQzNV0sWy0xNDIsLTIzOF0sWzEwMywtMjg0XSxbLTIxNCwtN10sWy0yMzgsLTIyM10sWy03NSwtMzg3XSxbLTE1NywtNTk3XSxbLTIxOSwtMjY0XSxbLTEzOCwtMTY5XSxbLTI1NiwxM10sWy0xODAsMTk0XSxbLTMwMiw0Ml0sWy00NiwyMTddLFsxNDksNDM4XSxbMzQ5LDU4M10sWzE3OSwxMTFdLFsyMDAsMjI1XSxbMjM4LDMxMF0sWzE2NywzMDZdLFsxMjMsNDQxXSxbMTA2LDE0OV0sWzQxLDMzMF0sWzE5NSwyNzNdLFs2MSwtMjUxXV0sW1s5ODUwMiwyOTIxOF0sWzIwMiwtNjIyXSxbNSw0MDNdLFsxMjYsLTE2MV0sWzQxLC00NDddLFsyMjQsLTE5Ml0sWzE4OCwtNDhdLFsxNTgsMjI2XSxbMTQxLC02OV0sWy02NywtNTI0XSxbLTg1LC0zNDVdLFstMjEyLDEyXSxbLTc0LC0xNzldLFsyNiwtMjU0XSxbLTQxLC0xMTBdLFstMTA1LC0zMTldLFstMTM4LC00MDRdLFstMjE0LC0yMzZdLFstNDgsMTU1XSxbLTExNiw4NV0sWzE2MCw0ODZdLFstOTEsMzI2XSxbLTI5OSwyMzZdLFs4LDIxNF0sWzIwMSwyMDZdLFs0Nyw0NTVdLFstMTMsMzgyXSxbLTExMywzOTZdLFs4LDEwNF0sWy0xMzMsMjQ0XSxbLTIxOCw1MjNdLFstMTE3LDQxOF0sWzEwNCw0Nl0sWzE1MSwtMzI4XSxbMjE2LC0xNTNdLFs3OCwtNTI2XV0sW1s5NjQyMSwzNzQ4N10sWy0xMDUsLTE0Ml0sWy0xNTMsMTYwXSxbLTE5OSwyNjZdLFstMTc5LDMxM10sWy0xODQsNDE2XSxbLTM4LDIwMV0sWzExOSwtOV0sWzE1NiwtMjAxXSxbMTIyLC0yMDBdLFs4OSwtMTY2XSxbMjI4LC0zNjZdLFsxNDQsLTI3Ml1dLFtbOTk1NDcsNDAzMzVdLFs5NiwtMTcxXSxbLTQ2LC0zMDhdLFstMTcyLC04MV0sWy0xNTMsNzNdLFstMjcsMjYwXSxbMTA3LDIwM10sWzEyNiwtNzRdLFs2OSw5OF1dLFtbMCw0MDc5OF0sWzk5ODIyLC0xNDVdLFstMTc3LC0xMjRdLFstMzYsMjIwXSxbMTM5LDEyMV0sWzg4LDMzXSxbLTk5ODM2LDE4NF1dLFtbMCw0MTA4N10sWzAsLTI4OV1dLFtbMCw0MTA4N10sWzU3LDI3XSxbLTM0LC0yODQtXSxbLTIzLC0zMl1dLFtbOTY2MjMsNDA4NTFdLFstOTIsLTc4XSxbLTkzLDI1OV0sWzEwLDE1OF0sWzE3NSwtMzM5XV0sW1s5NjQxOCw0MTc1Nl0sWzQ1LC00NzZdLFstNzUsNzRdLFstNTgsLTMyXSxbLTM5LDE2M10sWy02LDQ1M10sWzEzMywtMTgyXV0sW1s2MzkwNCw0MjU3MV0sWzQ1LC03MTFdLFs3MiwtMjc2XSxbLTI4LC0yODRdLFstNDksLTE3NF0sWy05NCwzNDddLFstNTMsLTE3NV0sWzUzLC00MzhdLFstMjQsLTI1MF0sWy03NywtMTM3XSxbLTE4LC01MDBdLFstMTA5LC02ODldLFstMTM3LC04MTRdLFstMTcyLC0xMTIwXSxbLTEwNiwtODIxXSxbLTEyNSwtNjg1XSxbLTIyNiwtMTQwXSxbLTI0MywtMjUwXSxbLTE2MCwxNTFdLFstMjIwLDIxMV0sWy03NywzMTJdLFstMTgsNTI0XSxbLTk4LDQ3MV0sWy0yNiw0MjVdLFs1MCw0MjZdLFsxMjgsMTAyXSxbMSwxOTddLFsxMzMsNDQ3XSxbMjUsMzc3XSxbLTY1LDI4MF0sWy01MiwzNzJdLFstMjMsNTQ0XSxbOTcsMzMxXSxbMzgsMzc1XSxbMTM4LDIyXSxbMTU1LDEyMV0sWzEwMywxMDddLFsxMjIsN10sWzE1OCwzMzddLFsyMjksMzY0XSxbODMsMjk3XSxbLTM4LDI1M10sWzExOCwtNzFdLFsxNTMsNDEwXSxbNiwzNTZdLFs5MiwyNjRdLFs5NiwtMjU0XSxbNzQsLTI1MV0sWzY5LC0zOTBdXSwiY291bnRyaWVzIjpbXX0sImxhbmQiOnsidHlwZSI6Ikdlb21ldHJ5Q29sbGVjdGlvbiIsImdlb21ldHJpZXMiOltdfX0='
    )
      .then(res => res.json())
      .then(topo => {
        const W = 2048,
          H = 1024,
          c = document.createElement('canvas');
        c.width = W;
        c.height = H;
        const x = c.getContext('2d');
        const tr = topo.transform,
          sc = tr.scale,
          tl = tr.translate;
        const arcs = topo.arcs.map(a => {
          let px = 0,
            py = 0;
          return a.map(([dx, dy]) => {
            px += dx;
            py += dy;
            return [px * sc[0] + tl[0], py * sc[1] + tl[1]];
          });
        });
        const ring = ids => {
          const out = [];
          ids.forEach(i => {
            const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
            a.forEach((p, j) => {
              if (j || !out.length) out.push(p);
            });
          });
          return out;
        };
        const polys = [];
        const walk = o => {
          if (o.type === 'GeometryCollection') o.geometries.forEach(walk);
          else if (o.type === 'Polygon') polys.push(o.arcs);
          else if (o.type === 'MultiPolygon') o.arcs.forEach(p => polys.push(p));
        };
        walk(topo.objects.land);
        x.fillStyle = '#000';
        polys.forEach(p => {
          x.beginPath();
          p.forEach(r =>
            ring(r).forEach(([lo, la], j) => {
              const X = ((lo + 180) / 360) * W,
                Y = ((90 - la) / 180) * H;
              j ? x.lineTo(X, Y) : x.moveTo(X, Y);
            })
          );
          x.fill('evenodd');
        });
        const d = x.getImageData(0, 0, W, H).data;
        return (la, lo) => {
          const X = Math.min(W - 1, Math.max(0, Math.floor(((lo + 180) / 360) * W))),
            Y = Math.min(H - 1, Math.max(0, Math.floor(((90 - la) / 180) * H)));
          return d[(Y * W + X) * 4 + 3] > 100;
        };
      })
      .catch(() => null);

    return landMaskPromise;
  }

  // Active globe controllers registry for cleanup
  const activeGlobes = new Map();

  function initGlobeCanvas(canvas) {
    if (!canvas || activeGlobes.has(canvas)) return;

    const g = { el: canvas, raf: 0, ro: null, tex: null, img: null };
    activeGlobes.set(canvas, g);

    const TW = 1024,
      TH = 512;

    const hash = (x, y) => {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    const vnoise = (x, y) => {
      const xi = Math.floor(x),
        yi = Math.floor(y),
        xf = x - xi,
        yf = y - yi;
      const u = xf * xf * (3 - 2 * xf),
        v = yf * yf * (3 - 2 * yf);
      const w = n => ((n % 64) + 64) % 64;
      const a = hash(w(xi), yi),
        b = hash(w(xi + 1), yi),
        c = hash(w(xi), yi + 1),
        d = hash(w(xi + 1), yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };

    const fbm = (x, y) => {
      let s = 0,
        a = 0.5,
        f = 1;
      for (let i = 0; i < 5; i++) {
        s += a * vnoise(x * f, y * f);
        f *= 2;
        a *= 0.5;
      }
      return s;
    };

    const makeTex = isLand => {
      const col = new Uint8ClampedArray(TW * TH * 3),
        cloud = new Uint8ClampedArray(TW * TH),
        spec = new Uint8Array(TW * TH);
      for (let j = 0; j < TH; j++) {
        const la = 90 - ((j + 0.5) / TH) * 180;
        for (let i = 0; i < TW; i++) {
          const lo = ((i + 0.5) / TW) * 360 - 180,
            k = j * TW + i,
            nx = (i / TW) * 64,
            ny = (j / TH) * 32;
          const n = fbm(nx * 0.5, ny * 0.5);
          let r, gg, b;
          if (isLand(la, lo)) {
            const alat = Math.abs(la),
              t = 0.9 + n * 0.14;
            if (alat > 66 || (la > 59 && lo > -75 && lo < -10)) {
              r = 240 * t;
              gg = 246 * t;
              b = 255 * t;
            } else {
              r = (176 + n * 36) * t;
              gg = (202 + n * 28) * t;
              b = (244 + n * 10) * t;
            }
          } else {
            const ice = Math.abs(la) > 82 + n * 4;
            if (ice) {
              r = 236;
              gg = 243;
              b = 255;
            } else {
              const d = 0.8 + n * 0.32;
              r = 2 * d;
              gg = 64 * d;
              b = 192 * d;
              spec[k] = 1;
            }
          }
          col[k * 3] = r;
          col[k * 3 + 1] = gg;
          col[k * 3 + 2] = b;
          const c = fbm(nx * 0.9 + 17, ny * 1.4 + 3);
          cloud[k] = Math.max(0, Math.min(255, (c - 0.5) * 3.2 * 255));
        }
      }
      g.tex = { col, cloud, spec };
    };

    // Instant procedural land fallback
    const noiseLand = (la, lo) => fbm(((lo + 180) / 360) * 12, ((90 - la) / 180) * 6) > 0.52;
    makeTex(noiseLand);

    // Asynchronously enhance with true continents
    getLandMask().then(m => {
      if (m && activeGlobes.get(canvas) === g) {
        makeTex(m);
        draw(performance.now());
      }
    });

    const off = document.createElement('canvas');

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * d));
      canvas.height = Math.max(1, Math.round(r.height * d));
    };

    size();

    if (window.ResizeObserver) {
      g.ro = new ResizeObserver(() => {
        size();
        draw(performance.now());
      });
      g.ro.observe(canvas);
    }

    const tilt = 1.02,
      ca = Math.cos(tilt),
      sa = Math.sin(tilt);
    const L = [-0.5, 0.62, 0.6];
    {
      const n = Math.hypot(...L);
      L[0] /= n;
      L[1] /= n;
      L[2] /= n;
    }
    const Hh = [L[0], L[1], L[2] + 1];
    {
      const n = Math.hypot(...Hh);
      Hh[0] /= n;
      Hh[1] /= n;
      Hh[2] /= n;
    }

    const draw = t => {
      const ctx = canvas.getContext('2d');
      const W = canvas.width,
        H = canvas.height;
      if (!W || !H || !g.tex) return;

      ctx.clearRect(0, 0, W, H);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const s = W / 2103,
        cx = 1051 * s,
        cy = 2122 * s,
        R = 1542 * s;
      const q = 2,
        OW = Math.ceil(W / q),
        top = Math.max(0, Math.floor((cy - R) / q) - 2),
        OH = Math.ceil(H / q) - top;
      if (OH <= 0) return;

      if (off.width !== OW || off.height !== OH) {
        off.width = OW;
        off.height = OH;
        g.img = off.getContext('2d').createImageData(OW, OH);
      }
      const img = g.img,
        px = img.data;
      px.fill(0);
      const rot = t * ((Math.PI * 2) / 60000),
        crot = t * ((Math.PI * 2) / 42000);
      const { col, cloud, spec } = g.tex;

      for (let yy = 0; yy < OH; yy++) {
        const ny = (cy - (yy + top + 0.5) * q) / R,
          ny2 = ny * ny;
        if (ny2 >= 1) continue;
        const half = Math.sqrt(1 - ny2),
          x0 = Math.max(0, Math.floor((cx - half * R) / q)),
          x1 = Math.min(OW - 1, Math.ceil((cx + half * R) / q));
        for (let xx = x0; xx <= x1; xx++) {
          const nx = ((xx + 0.5) * q - cx) / R,
            rr = nx * nx + ny2;
          if (rr >= 1) continue;
          const nz = Math.sqrt(1 - rr);
          const y = ny * ca + nz * sa,
            z = -ny * sa + nz * ca;
          const lat = Math.asin(Math.max(-1, Math.min(1, y)));
          let lon = Math.atan2(nx, z) - rot;
          const u = ((((lon / (Math.PI * 2)) % 1) + 1) % 1),
            v = 0.5 - lat / Math.PI;
          const ti = Math.min(TW - 1, (u * TW) | 0),
            tj = Math.min(TH - 1, Math.max(0, (v * TH) | 0)),
            k = tj * TW + ti;
          const lamb = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
          const light = 0.28 + 0.9 * lamb;
          const fu = u * TW - 0.5,
            fv = Math.max(0, Math.min(TH - 1.001, v * TH - 0.5)),
            i0 = Math.floor(fu),
            j0 = Math.floor(fv),
            du = fu - i0,
            dv = fv - j0,
            ia = ((i0 % TW) + TW) % TW,
            ib = (ia + 1) % TW,
            jb = Math.min(TH - 1, j0 + 1);
          const k00 = (j0 * TW + ia) * 3,
            k10 = (j0 * TW + ib) * 3,
            k01 = (jb * TW + ia) * 3,
            k11 = (jb * TW + ib) * 3,
            w00 = (1 - du) * (1 - dv),
            w10 = du * (1 - dv),
            w01 = (1 - du) * dv,
            w11 = du * dv;
          let r = (col[k00] * w00 + col[k10] * w10 + col[k01] * w01 + col[k11] * w11) * light,
            gg = (col[k00 + 1] * w00 + col[k10 + 1] * w10 + col[k01 + 1] * w01 + col[k11 + 1] * w11) * light,
            b = (col[k00 + 2] * w00 + col[k10 + 2] * w10 + col[k01 + 2] * w01 + col[k11 + 2] * w11) * light;
          if (spec[k]) {
            const sp = Math.pow(Math.max(0, nx * Hh[0] + ny * Hh[1] + nz * Hh[2]), 40) * 150;
            r += sp;
            gg += sp;
            b += sp;
          }
          const cu = ((((Math.atan2(nx, z) - crot) / (Math.PI * 2)) % 1) + 1) % 1,
            ck = tj * TW + Math.min(TW - 1, (cu * TW) | 0);
          const ca2 = (cloud[ck] / 255) * 0.7;
          if (ca2 > 0) {
            const cl = 255 * (0.45 + 0.6 * lamb);
            r += (cl - r) * ca2;
            gg += (cl - gg) * ca2;
            b += (cl - b) * ca2;
          }
          const limb = Math.pow(1 - nz, 2.2);
          r += (190 - r) * limb * 0.75;
          gg += (216 - gg) * limb * 0.75;
          b += (255 - b) * limb * 0.75;
          const a = Math.min(1, (((1 - Math.sqrt(rr)) * R) / q / 1.2));
          const o = (yy * OW + xx) * 4;
          px[o] = r;
          px[o + 1] = gg;
          px[o + 2] = b;
          px[o + 3] = 255 * a;
        }
      }
      off.getContext('2d').putImageData(img, 0, 0);
      ctx.save();
      ctx.shadowColor = 'rgba(96,160,245,0.7)';
      ctx.shadowBlur = 46 * dpr;
      ctx.fillStyle = 'rgba(160,200,250,0.6)';
      ctx.beginPath();
      ctx.arc(cx, cy, R + 2 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(off, 0, top * q, OW * q, OH * q);
      const atm = ctx.createRadialGradient(cx, cy, R * 0.985, cx, cy, R * 1.03);
      atm.addColorStop(0, 'rgba(140,195,255,0)');
      atm.addColorStop(0.45, 'rgba(140,195,255,0.55)');
      atm.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = atm;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.03, 0, Math.PI * 2);
      ctx.fill();
    };

    let last = 0;
    const loop = t => {
      g.raf = requestAnimationFrame(loop);
      if (t - last < 33) return; // ~30-40fps throttle for great battery & performance
      last = t;
      draw(t);
    };

    draw(performance.now());
    if (!isReducedMotion()) {
      g.raf = requestAnimationFrame(loop);
    }
  }

  function destroyGlobeCanvas(canvas) {
    const g = activeGlobes.get(canvas);
    if (!g) return;
    if (g.raf) cancelAnimationFrame(g.raf);
    if (g.ro) g.ro.disconnect();
    activeGlobes.delete(canvas);
  }

  // Mobile Accordion Initialization
  function initAccordions(section) {
    const cols = section.querySelectorAll('.hp-footer-col');
    if (!cols.length) return;

    cols.forEach(col => {
      const btn = col.querySelector('.hp-footer-acc-btn');
      if (!btn || btn.dataset.accBound === 'true') return;

      btn.dataset.accBound = 'true';

      btn.addEventListener('click', function (e) {
        if (window.innerWidth >= 760) return; // Desktop/Tablet clicks do not collapse
        e.preventDefault();

        const isOpen = col.classList.contains('is-open');

        // Optional: close other columns for single-accordion accordion feel on mobile
        cols.forEach(other => {
          if (other !== col && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            const otherBtn = other.querySelector('.hp-footer-acc-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          col.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          col.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // Footer Section Bootstrapper
  function initFooter(section) {
    if (!section) return;

    // 1. Globe Canvas
    const canvas = section.querySelector('.hp-footer-globe-canvas');
    if (canvas) {
      initGlobeCanvas(canvas);
    }

    // 2. Accordions
    initAccordions(section);
  }

  function destroyFooter(section) {
    if (!section) return;
    const canvas = section.querySelector('.hp-footer-globe-canvas');
    if (canvas) {
      destroyGlobeCanvas(canvas);
    }
  }

  // Document Ready & Shopify Theme Editor Handlers
  function bootAll() {
    document.querySelectorAll('.hp-footer-wrapper').forEach(initFooter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAll);
  } else {
    bootAll();
  }

  document.addEventListener('shopify:section:load', function (e) {
    const section = e.target.querySelector('.hp-footer-wrapper');
    if (section) initFooter(section);
  });

  document.addEventListener('shopify:section:unload', function (e) {
    const section = e.target.querySelector('.hp-footer-wrapper');
    if (section) destroyFooter(section);
  });
})();
