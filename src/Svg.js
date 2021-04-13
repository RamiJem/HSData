import { useRef, useEffect } from 'react'
import { select, axisBottom, scaleLinear, axisLeft, range } from 'd3'
import { useResizeObserver } from './ResizeObserver'

export const Svg = ({data, visible}) => {
    const svgRef = useRef()
    const svgWrapperRef = useRef()
    const dimensions = useResizeObserver(svgWrapperRef)
  
    useEffect(() => {
        const svg = select(svgRef.current)

        if(!dimensions) return
        const xScale = scaleLinear()
            .domain([-20, 20])
            .range([-dimensions.width/2, dimensions.width+(dimensions.width/2)])
        const xAxis = axisBottom(xScale).ticks(data.length).ticks(40)
        
        svg
            .select('.x-axis')
            .style('transform', `translateY(${dimensions.height/2}px)`)
            .call(xAxis)

        const yScale = scaleLinear()
            .domain([20, -20])
            .range([(dimensions.height/2) - (dimensions.width), dimensions.height/2+dimensions.width])

        const yAxis = axisLeft(yScale).ticks(40)
        svg
            .select('.y-axis')
            .style('transform', `translateX(${dimensions.width/2}px)`)
            .call(yAxis)
        
        // parallel lines for y axis
        svg.select('.grid')
            .selectAll('.yLine')
            .data(range(-30, 31))
            .join('line')
            .attr('class', 'yLine')
            .attr('x1', datum => xScale(datum))
            .attr('x2', datum => xScale(datum))
            .attr('y1', datum => yScale(datum + 30))
            .attr('y2', datum => yScale(datum -30))
            .attr('stroke', 'white')
            .attr('opacity', 0.2)
        // parallel lines for x axis
        svg.select('.grid')
            .selectAll('.xLine')
            .data(range(-30, 31))
            .join('line')
            .attr('class', 'xLine')
            .attr('x1', datum => xScale(datum-30))
            .attr('x2', datum => xScale(datum+30))
            .attr('y1', datum => yScale(datum))
            .attr('y2', datum => yScale(datum))
            .attr('stroke', 'white')
            .attr('opacity', 0.2)

        const svgCircles = svg.select('.axes')

        //  defining transition for callback
        const t = svgCircles.transition()
            .duration(1000)

        svgCircles
            .selectAll('circle')
            .data(data, d => d.key)
            .join(
                enter => enter.append('circle')
                    .attr('cx', datum => xScale(datum.x))
                    .attr('cy', datum => yScale(datum.y))
                    .attr('stroke-width', 0.5)
                    .call(enter => enter.transition(t)
                    .attr('r', datum => datum.r)
                    .attr('stroke', datum => datum.stroke)
                    .attr('fill', datum => datum.fill))
                    .attr('opacity', 0.9),
                update => update
                    .call( update => update.transition(t)
                    .attr('cx', datum => xScale(datum.x))
                    .attr('cy', datum => yScale(datum.y)))
            )
    }, [dimensions, data, visible])
    return (
        <div ref={svgWrapperRef} className='background'>
                <svg ref={svgRef}>
                    <g className="axes" style={{color: 'white'}}>
                        <g className='grid'/>
                        <g className='x-axis' />
                        <g className='y-axis' />
                    </g>
                </svg>
        </div>
    )
}