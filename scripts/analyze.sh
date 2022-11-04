# analyze.sh
#!/bin/bash

rollup-plugin-visualizer \
    --title 'Network Analysis' \
    --filename ./rollup-viz/network.html \
    --template network 'rollup-analyze.json' \
    && open ./rollup-viz/network.html;

rollup-plugin-visualizer \
    --title 'Sunburst Analysis' \
    --filename ./rollup-viz/sunburst.html \
    --template sunburst 'rollup-analyze.json' \
    && open ./rollup-viz/sunburst.html;

rollup-plugin-visualizer \
    --title 'Treemap Analysis' \
    --filename ./rollup-viz/treemap.html \
    --template treemap 'rollup-analyze.json' \
    && open ./rollup-viz/treemap.html;
