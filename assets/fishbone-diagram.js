// assets/fishbone-diagram.js
import * as utils from './fishbone-utils.js';
import { getSolutionRelationships } from './correlation-utils.js';

export function renderFishboneDiagram(containerId, analysisData, allData) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID ${containerId} not found`);
            return;
        }

        // Clear container and add tooltip
        container.innerHTML = '<div class="fishbone-tooltip" role="tooltip"></div>';
        
        // Get container dimensions
        const containerStyle = window.getComputedStyle(container);
        const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
        const paddingTop = parseFloat(containerStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(containerStyle.paddingBottom) || 0;
        
        const availableWidth = container.clientWidth - paddingLeft - paddingRight;
        const availableHeight = container.clientHeight - paddingTop - paddingBottom;
        
        // Set dimensions with minimum size
        const width = Math.max(availableWidth, 800);
        const height = Math.max(availableHeight, 600);
        const centerY = height / 2;

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('role', 'img')
            .attr('aria-label', 'Diagram Fishbone')
            .append('g');

        // Main horizontal spine
        const spineLength = width * 0.8;
        const spineStartX = width * 0.1;
        const spineEndX = spineStartX + spineLength;
        
        svg.append('line')
            .attr('x1', spineStartX)
            .attr('y1', centerY)
            .attr('x2', spineEndX)
            .attr('y2', centerY)
            .attr('class', 'fishbone-line')
            .attr('stroke-width', 3);

        // Fish head (arrowhead)
        svg.append('path')
            .attr('d', `M ${spineEndX + 20},${centerY} L ${spineEndX},${centerY - 15} L ${spineEndX},${centerY + 15} Z`)
            .attr('class', 'fishbone-head')
            .attr('fill', '#333');

        // Main problem label
        svg.append('text')
            .attr('x', spineEndX + 30)
            .attr('y', centerY - 25)
            .attr('text-anchor', 'middle')
            .attr('class', 'fishbone-problem')
            .text('Masalah Utama');

        // Prepare solution relationships data
        const solutionRelationships = getSolutionRelationships(analysisData, allData);

        // Standard fishbone categories in correct order (6M)
        const standardCategories = ['man', 'method', 'machine', 'measurement', 'material', 'mothernature'];
        
        // Filter and order categories according to standard fishbone structure
        const orderedCategories = standardCategories.filter(cat => analysisData[cat]);
        const remainingCategories = Object.keys(analysisData).filter(cat => !standardCategories.includes(cat));
        const allCategories = [...orderedCategories, ...remainingCategories];

        // Define which categories should be on top (upper) and bottom (lower)
        // According to standard fishbone: Man, Method, Machine on top
        const upperCategories = ['man', 'method', 'machine'].filter(cat => allCategories.includes(cat));
        const lowerCategories = allCategories.filter(cat => !upperCategories.includes(cat));

        // Draw bones for each category
        const boneLength = Math.min(200, width * 0.3);
        const boneAngle = 45; // 45 degree angle for fishbone branches

        // Function to draw category bone
        const drawBone = (category, index, isUpper) => {
            const angle = isUpper ? (90 - boneAngle) * Math.PI/180 : (90 + boneAngle) * Math.PI/180;
            
            // Calculate yOffset to spread bones evenly
            const yOffset = isUpper ? -40 - (index * 80) : 40 + (index * 80);
            
            // Bone start point (distributed along main spine)
            const startX = spineStartX + (spineLength * (0.2 + (index * 0.15)));
            const startY = centerY;
            
            // Bone end point
            const endX = startX + boneLength * Math.cos(angle);
            const endY = startY + boneLength * Math.sin(angle) + yOffset;

            // Main category bone line (diagonal)
            svg.append('line')
                .attr('x1', startX)
                .attr('y1', startY)
                .attr('x2', endX)
                .attr('y2', endY)
                .attr('class', `fishbone-bone category-${category}`)
                .attr('stroke', utils.getCategoryHexColor(category))
                .attr('stroke-width', 2);

            // Category label
            svg.append('text')
                .attr('x', endX + (isUpper ? -10 : 10))
                .attr('y', endY + (isUpper ? -20 : 30))
                .attr('text-anchor', isUpper ? 'end' : 'start')
                .attr('class', 'fishbone-category')
                .text(utils.formatCategoryName(category))
                .style('fill', utils.getCategoryHexColor(category))
                .style('font-weight', 'bold');

            // Causes on category bone
            const causes = analysisData[category];
            if (!Array.isArray(causes)) return;

            const causeSpacing = boneLength / (causes.length + 1);

            causes.forEach((causeId, j) => {
                const cause = allData[category]?.find(item => item.id === causeId);
                if (!cause) {
                    console.warn(`Cause with ID ${causeId} not found in category ${category}`);
                    return;
                }

                // Calculate cause position along diagonal line
                const t = (j + 1) / (causes.length + 1);
                const cx = startX + t * boneLength * Math.cos(angle);
                const cy = startY + t * boneLength * Math.sin(angle) + yOffset;
                const priorityClass = `cause-${(cause.priority || 'medium').toLowerCase()}`;

                // Determine branch direction (perpendicular to main bone)
                const branchLength = Math.min(50, width * 0.08);
                const branchAngle = angle + (isUpper ? -Math.PI/2 : Math.PI/2);
                const branchX = cx + branchLength * Math.cos(branchAngle);
                const branchY = cy + branchLength * Math.sin(branchAngle);

                // Draw branch line (perpendicular to main bone)
                svg.append('line')
                    .attr('x1', cx)
                    .attr('y1', cy)
                    .attr('x2', branchX)
                    .attr('y2', branchY)
                    .attr('class', 'fishbone-sub-bone')
                    .attr('stroke', utils.getCategoryHexColor(category))
                    .attr('stroke-width', 1);

                // Create cause dot at branch end
                const dot = svg.append('circle')
                    .attr('cx', branchX)
                    .attr('cy', branchY)
                    .attr('r', 5)
                    .attr('class', `fishbone-cause ${priorityClass}`)
                    .attr('aria-label', `Penyebab: ${cause.cause}, Prioritas: ${cause.priority}`)
                    .attr('role', 'button')
                    .attr('tabindex', '0')
                    .datum({cause, category});

                // Cause label (initially hidden)
                const maxLabelLength = Math.max(20, width * 0.04);
                const label = svg.append('text')
                    .attr('x', branchX + (isUpper ? -8 : 8))
                    .attr('y', branchY + (isUpper ? -15 : 20))
                    .attr('text-anchor', isUpper ? 'end' : 'start')
                    .attr('class', 'cause-label')
                    .text(utils.truncateText(cause.cause, maxLabelLength))
                    .style('font-size', `${Math.max(10, width * 0.012)}px`)
                    .style('opacity', 0)
                    .style('fill', utils.getPriorityHexColor(cause.priority));
                    
                // Interaction handlers
                const showTooltip = (event, d) => {
                    const tooltip = d3.select('.fishbone-tooltip');
                    tooltip
                        .html(`
                            <div class="fw-bold">${d.cause.cause}</div>
                            <div class="small mt-1">${utils.truncateText(d.cause.description, 120)}</div>
                            <div class="mt-2">
                                <span class="badge bg-${utils.getPriorityColor(d.cause.priority)}">
                                    ${d.cause.priority || 'Medium'}
                                </span>
                                <span class="badge bg-${utils.getCategoryColor(d.category)}">
                                    ${utils.formatCategoryName(d.category)}
                                </span>
                            </div>
                            ${d.cause.solutions?.length ? `
                                <div class="mt-2">
                                    <strong>Solusi:</strong>
                                    <ul class="small mb-0">
                                        ${d.cause.solutions.slice(0, 3).map(sol => `<li>${sol}</li>`).join('')}
                                        ${d.cause.solutions.length > 3 ? `<li>+${d.cause.solutions.length - 3} more</li>` : ''}
                                    </ul>
                                </div>
                            ` : ''}
                        `)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 30) + 'px')
                        .style('opacity', 1);
                        
                    label.style('opacity', 1);
                };

                const hideTooltip = () => {
                    d3.select('.fishbone-tooltip').style('opacity', 0);
                    label.style('opacity', 0);
                };

                const highlightRelated = (d) => {
                    if (!d.cause.solutions?.length) return;
                    
                    svg.selectAll('.fishbone-cause')
                        .attr('stroke', null)
                        .attr('stroke-width', null)
                        .attr('r', 5);
                    
                    dot.attr('stroke', 'white')
                        .attr('stroke-width', 2)
                        .attr('r', 7);
                    
                    const matchingCauses = solutionRelationships[d.cause.id] || [];
                    
                    svg.selectAll('.fishbone-cause')
                        .filter(node => matchingCauses.includes(node.cause.id))
                        .attr('stroke', '#ff0')
                        .attr('stroke-width', 2)
                        .attr('r', 6);
                };

                dot.on('mouseover', showTooltip)
                   .on('mouseout', hideTooltip)
                   .on('click', (event, d) => highlightRelated(d))
                   .on('keypress', function(event, d) {
                       if (event.key === 'Enter' || event.key === ' ') {
                           event.preventDefault();
                           highlightRelated(d);
                       }
                   });
            });
        };

        // Draw bones for upper categories (Man, Method, Machine)
        upperCategories.forEach((category, i) => {
            drawBone(category, i, true);
        });

        // Draw bones for lower categories (Measurement, Material, Mother Nature)
        lowerCategories.forEach((category, i) => {
            drawBone(category, i, false);
        });

        // Add responsive legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - Math.min(150, width * 0.25)}, 20)`);
        
        const priorities = [
            { label: 'Critical', color: '#dc3545' },
            { label: 'High', color: '#fd7e14' },
            { label: 'Medium', color: '#ffc107' },
            { label: 'Low', color: '#28a745' }
        ];
        
        priorities.forEach((priority, i) => {
            legend.append('circle')
                .attr('cx', 10)
                .attr('cy', 10 + i * 20)
                .attr('r', 5)
                .attr('fill', priority.color);
            
            legend.append('text')
                .attr('x', 20)
                .attr('y', 13 + i * 20)
                .attr('dy', '0.35em')
                .text(priority.label)
                .style('font-size', `${Math.max(10, width * 0.012)}px`);
        });

        // Add resize event listener with debounce
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                renderFishboneDiagram(containerId, analysisData, allData);
            }, 200);
        });
    } catch (error) {
        console.error('Error rendering fishbone diagram:', error);
    }
}