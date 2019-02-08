/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {MDCComponent} from '@material/base/component';

import {MDCTabScrollerAdapter} from './adapter';
import MDCTabScrollerFoundation from './foundation';
import * as util from './util';

/**
 * @extends {MDCComponent<!MDCTabScrollerFoundation>}
 * @final
 */
class MDCTabScroller extends MDCComponent<MDCTabScrollerFoundation> {
  /**
   * @param {!Element} root
   * @return {!MDCTabScroller}
   */
  static attachTo(root: Element): MDCTabScroller {
    return new MDCTabScroller(root);
  }

  area_!: HTMLElement;
  content_!: HTMLElement;
  handleInteraction_!: EventListenerOrEventListenerObject;
  handleTransitionEnd_!: EventListenerOrEventListenerObject;
  initialize() {
    this.area_ = this.root_.querySelector(MDCTabScrollerFoundation.strings.AREA_SELECTOR) as HTMLElement;
    this.content_ = this.root_.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR) as HTMLElement;
  }

  initialSyncWithDOM() {
    this.handleInteraction_ = () => this.foundation_.handleInteraction();
    this.handleTransitionEnd_ = (
      (evt: TransitionEvent) => this.foundation_.handleTransitionEnd(evt)) as EventListenerOrEventListenerObject;

    this.area_.addEventListener('wheel', this.handleInteraction_);
    this.area_.addEventListener('touchstart', this.handleInteraction_);
    this.area_.addEventListener('pointerdown', this.handleInteraction_);
    this.area_.addEventListener('mousedown', this.handleInteraction_);
    this.area_.addEventListener('keydown', this.handleInteraction_);
    this.content_.addEventListener('transitionend', this.handleTransitionEnd_);
  }

  destroy() {
    super.destroy();

    this.area_.removeEventListener('wheel', this.handleInteraction_);
    this.area_.removeEventListener('touchstart', this.handleInteraction_);
    this.area_.removeEventListener('pointerdown', this.handleInteraction_);
    this.area_.removeEventListener('mousedown', this.handleInteraction_);
    this.area_.removeEventListener('keydown', this.handleInteraction_);
    this.content_.removeEventListener('transitionend', this.handleTransitionEnd_);
  }

  /**
   * @return {!MDCTabScrollerFoundation}
   */
  getDefaultFoundation(): MDCTabScrollerFoundation {
    const adapter: MDCTabScrollerAdapter = ({
      addClass: (className: string) => this.root_.classList.add(className),
      addScrollAreaClass: (className) => this.area_.classList.add(className),
      computeHorizontalScrollbarHeight: () => util.computeHorizontalScrollbarHeight(document),
      computeScrollAreaClientRect: () => this.area_.getBoundingClientRect(),
      computeScrollContentClientRect: () => this.content_.getBoundingClientRect(),
      eventTargetMatchesSelector: (evtTarget, selector): boolean => {
        // tslint:disable-next-line
        const MATCHES = util.getMatchesProperty(HTMLElement.prototype as any);
        // tslint:disable-next-line
        return (evtTarget as any)[MATCHES](selector);
      },
      getScrollAreaOffsetWidth: () => this.area_.offsetWidth,
      getScrollAreaScrollLeft: () => this.area_.scrollLeft,
      getScrollContentOffsetWidth: () => this.content_.offsetWidth,
      getScrollContentStyleValue: (propName) => window.getComputedStyle(this.content_).getPropertyValue(propName),
      removeClass: (className) => this.root_.classList.remove(className),
      setScrollAreaScrollLeft: (scrollX) => this.area_.scrollLeft = scrollX,
      setScrollAreaStyleProperty: (prop, value) => this.area_.style.setProperty(prop, value),
      setScrollContentStyleProperty: (prop, value) => this.content_.style.setProperty(prop, value),
    });

    return new MDCTabScrollerFoundation(adapter);
  }

  /**
   * Returns the current visual scroll position
   * @return {number}
   */
  getScrollPosition(): number {
    return this.foundation_.getScrollPosition();
  }

  /**
   * Returns the width of the scroll content
   * @return {number}
   */
  getScrollContentWidth(): number {
    return this.content_.offsetWidth;
  }

  /**
   * Increments the scroll value by the given amount
   * @param {number} scrollXIncrement The pixel value by which to increment the scroll value
   */
  incrementScroll(scrollXIncrement: number) {
    this.foundation_.incrementScroll(scrollXIncrement);
  }

  /**
   * Scrolls to the given pixel position
   * @param {number} scrollX The pixel value to scroll to
   */
  scrollTo(scrollX: number) {
    this.foundation_.scrollTo(scrollX);
  }
}

export {MDCTabScroller, MDCTabScrollerFoundation, util};