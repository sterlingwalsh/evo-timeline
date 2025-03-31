import * as d3 from 'd3';
import { D3ZoomEvent } from 'd3';
import { Require } from '../../../types/utility';
import classes from './timeline.module.scss';

export interface TimelineDataPoint<T extends object = object> {
	data: T;
	x: Date;
	y?: number;
	color?: string;
	id?: string | number;
	radius?: number;
	categoryId?: string | number;
}

export interface TimelineCategory {
	y: number;
	id: string | number;
	title: string;
	color: string;
}

type CompleteTimelineDataPoint<T extends object = object> = Require<
	TimelineDataPoint<T>,
	'y' | 'color' | 'radius'
> & {};

export class TimelineController<T extends object = object> {
	initialized: boolean = false;
	private _el: SVGSVGElement | null = null;
	private _root: HTMLDivElement | null = null;
	private _data: CompleteTimelineDataPoint<T>[] = [];
	private _categories: TimelineCategory[] = [];

	private scaleX = d3.scaleTime();
	private scaleY = d3.scaleLinear();
	private extentX: [Date, Date] = [new Date(0), new Date()];
	private axisX: d3.Axis<Date | d3.NumberValue> | undefined = undefined;

	private spacing = 6;
	private categoryMap = new Map<string | number, TimelineCategory>();

	private tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined> | undefined = undefined;

	getHoverDetails?: (item: T) => { title?: string; text?: string[]; image?: string };
	onItemClick?: (item: T) => void;

	constructor() {}

	public get el(): SVGSVGElement | null {
		return this._el;
	}

	init(
		data: TimelineDataPoint<T>[],
		categories: TimelineCategory[] = [],
		svg: SVGSVGElement | null,
		root: HTMLDivElement | null
	) {
		this._el = svg;
		this._root = root;
		if (!data.length) return;
		this.analyzeData(data, categories);

		this.setupSize();

		this.redraw();

		this.setupZoom();

		this.initialized = true;
	}

	setupSize() {
		const rect = this._root?.getBoundingClientRect();
		d3.select(this._el)
			.attr('width', rect?.width ?? 100)
			.attr('height', rect?.height ?? 100);
	}

	analyzeData(data: TimelineDataPoint<T>[], categories: TimelineCategory[]) {
		categories.sort((a, b) => a.y - b.y);
		this._categories = categories;
		this.categoryMap = new Map(categories.map((c) => [c.id, c]));

		const completeData: CompleteTimelineDataPoint<T>[] = data.map((d) => ({
			...d,
			y: d.y ?? this.categoryMap.get(d.categoryId ?? '')?.y ?? 0,
			color: d.color ?? this.categoryMap.get(d.categoryId ?? '')?.color ?? '#888',
			radius: d.radius ?? 5,
		}));

		this._data = completeData;
	}

	setupTooltip() {
		this.tooltip = d3
			.select(this._root)
			.append('div')
			.attr('id', '_tooltip')
			.style('visibility', 'hidden')
			.attr('class', classes.tooltip_root);

		this.tooltip.append('text').attr('fill', 'white');
	}

	redraw() {
		d3.select(this._el).selectAll('*').remove();
		this.draw();
		this.setupTooltip();
	}

	private draw() {
		const bounds = this._root?.getBoundingClientRect();

		const chart = d3.select(this._el);
		const categoryContainer = chart.append('g').attr('class', 'categorycontainer');
		const rowsContainer = chart.append('g').attr('class', 'rowscontainer');
		const chartBody = chart.append('g').attr('class', 'chart-body');

		// X Axis
		this.extentX = d3.extent(this._data.map((d, i) => d.x)) as [Date, Date];
		const [minX, maxX] = this.extentX;
		this.scaleX = d3.scaleTime().domain([minX, maxX]).nice();

		this.axisX = d3.axisBottom(this.scaleX);

		const gx = chartBody.append('g').attr('id', 'x-axis').call(this.axisX);

		const gxBounds = gx.node()?.getBoundingClientRect();
		const usableY = (bounds?.height ?? 0) - (gxBounds?.height ?? 0);

		// Y Spacing

		gx.attr('transform', `translate(0,${usableY})`);

		const rowHeight = usableY / this._categories.length;

		const [minY, maxY] = d3.extent(this._data.map((d, i) => d.y));
		this.scaleY = d3
			.scaleLinear()
			.domain([minY ?? 0, maxY ?? 0])
			.range([usableY - rowHeight / 2, 0 + rowHeight / 2])
			.nice();

		// Y Controls

		categoryContainer
			.selectAll<SVGGElement, TimelineDataPoint<T>>('g.categoryitem')
			.data(this._categories, (c, i) => c.id ?? i)
			.join((enter) => {
				const g = enter.append('g').attr('class', 'categoryitem');

				const rect = g
					.append('rect')
					.attr('rx', 5)
					.attr('ry', 5)
					.attr('stroke', (c) => c.color)
					.attr('stroke-width', 2)
					.attr('x', 0)
					.attr('y', 0);

				const text = g
					.append('text')
					.text((c) => c.title)
					.attr('fill', (c) => c.color);

				const textSize = text.node()?.getBoundingClientRect();

				const textH = textSize?.height ?? 0;

				const rectH = textH + this.spacing * 2;

				// rect.attr('width', textW + this.spacing * 4);
				rect.attr('height', textH + this.spacing * 2);

				text.attr('x', this.spacing).attr('y', textH);

				g.attr('transform', (c, i) => `translate(0, ${this.scaleY(i) - rectH / 2})`);

				return g;
			});

		const categoriesWidth = (categoryContainer.node()?.getBoundingClientRect().width ?? 0) + this.spacing * 2;

		categoryContainer.selectAll('rect').attr('width', categoriesWidth);

		const categoryItems = chart.selectAll<SVGGElement, TimelineCategory>('.categoryitem');
		rowsContainer
			.selectAll<SVGGElement, TimelineDataPoint<T>>('g.categoryrowcontainer')
			.data(this._categories, (c, i) => c.id ?? i)
			.join((enter) => {
				const g = enter.append('g').attr('class', 'categoryrowitem');

				const bkg = g
					.append('rect')
					.attr('rx', 12)
					.attr('ry', 12)
					.attr('x', 0)
					.attr('y', 0)
					.attr('data-category', (c) => c.id)
					.attr('height', (c, i) => categoryItems.nodes()[c.y]?.getBoundingClientRect().height)
					.attr('fill', '#000000')
					.style('opacity', 0.15)
					.on('mouseenter', function (evt, d) {
						d3.select(this).attr('fill', d.color);
					})
					.on('mouseleave', function () {
						d3.select(this).attr('fill', '#000000');
					});
				const left = categoriesWidth + this.spacing;
				bkg.attr('width', (bounds?.width ?? 0) - left);

				g.attr(
					'transform',
					(c, i) =>
						`translate(${left}, ${this.scaleY(i) - categoryItems.nodes()[i]?.getBoundingClientRect().height / 2})`
				);

				return g;
			});

		const bodyWidth = (bounds?.width ?? 1000) - (categoriesWidth + this.spacing);
		this.scaleX.range([0, bodyWidth]);

		// domain padding
		const insetDate = this.scaleX.invert(this.spacing * 3);
		const padding = Math.abs(insetDate.valueOf() - minX.valueOf());
		const paddedMin = new Date(minX.valueOf() - padding);
		const paddedMax = new Date(maxX.valueOf() + padding);
		this.scaleX.domain([paddedMin, paddedMax]);

		chartBody.attr('transform', `translate(${categoriesWidth + this.spacing}, 0)`);

		// Points
		chartBody.select<SVGGElement>('#x-axis').call(this.axisX);
		chartBody
			.selectAll<SVGGElement, TimelineDataPoint<T>>('g.dataitem')
			.data(this._data, (d, i) => d.id ?? i)
			.join((enter) => {
				const g = enter.append('g').attr('class', 'dataitem');

				g.attr('transform', (d) => `translate(${this.scaleX(d.x) - d.radius}, ${this.scaleY(d.y) - d.radius})`);

				g.append('circle')
					.attr('cx', (d) => d.radius)
					.attr('cy', (d) => d.radius)
					.attr('r', (d) => d.radius)
					.attr('stroke-width', 2)
					.attr('stroke', (d) => d.color)
					.attr('fill', 'transparent')
					.style('cursor', 'pointer')
					.on('mouseenter', (evt, d) => {
						const [mx, my] = d3.pointer(evt, this._el);
						const tooltip = this.tooltip
							?.style('visibility', 'visible')
							.style('transform', `translate(${mx + 15}px, ${my}px)`);

						const details = this.getHoverDetails?.(d.data);

						const html = `
								<div class="${classes.tooltip_icon}">
									${details?.image ?? ''}
								</div>
								<div class="${classes.tooltip_description}">
									<div class="${classes.tooltip_title}">${details?.title ?? ''}</div>
									<div class="${classes.tooltip_details}">${details?.text?.map((d) => `<div>${d}</div>`).join('')}</div>
								</div>
						`;
						tooltip?.html(html);

						d3.select(this._el).select(`rect[data-category="${d.categoryId}"`).attr('fill', d.color);
					})
					.on('mousemove', (evt, ...args) => {
						const [mx, my] = d3.pointer(evt, this._el);
						this.tooltip?.style('transform', `translate(${mx + 15}px, ${my}px)`);
					})
					.on('mouseleave', (evt, d) => {
						this.tooltip?.style('visibility', 'hidden').select('text').text('').html('');
						d3.select(this._el).select(`rect[data-category:"${d.categoryId}"`).attr('fill', '#000000');
					})
					.on('click', (evt, d) => {
						this.onItemClick?.(d.data);
					});

				g.append('line')
					.attr('x1', (d, i) => d.radius)
					.attr('x2', (d, i) => d.radius)
					.attr('y1', (d, i) => d.radius * 2)
					.attr('y2', (d, i) => usableY + d.radius - this.scaleY(d.y))
					.attr('stroke', (d) => d.color)
					.style('pointer-events', 'none');

				return g;
			});
	}

	setupZoom() {
		if (!this._el) return;
		const zoom = d3.zoom().on('zoom', this.handleZoom.bind(this));
		d3.select(this._el as Element).call(zoom);
	}

	handleZoom(evt: D3ZoomEvent<SVGSVGElement, T>) {
		const { transform, sourceEvent } = evt;
		console.log(evt.type);
		if (!this.axisX) return;

		const transitionDuration = sourceEvent.type === 'mousemove' ? 0 : 250;

		const newScaleX = transform.rescaleX(this.scaleX);
		this.axisX.scale(newScaleX);

		const chart = d3.select(this._el);
		chart
			.select<SVGGElement>('#x-axis')
			// .transition()
			// .duration(transitionDuration)
			.call(this.axisX);

		chart
			.selectAll<SVGGElement, CompleteTimelineDataPoint<T>>('g.dataitem')
			.attr('transform', (d) => `translate(${newScaleX(d.x) - d.radius}, ${this.scaleY(d.y) - d.radius})`)
			.style('visibility', (d) =>
				newScaleX(d.x) - d.radius < 0 || newScaleX(d.x) > newScaleX.range()[1] ? 'hidden' : 'visible'
			);
	}
}
