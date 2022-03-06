
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe$1(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe$1(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class Subscribable {
        constructor() {
            this.listeners = [];
        }
        subscribe(listener) {
            const callback = listener || (() => undefined);
            this.listeners.push(callback);
            this.onSubscribe();
            return () => {
                this.listeners = this.listeners.filter(x => x !== callback);
                this.onUnsubscribe();
            };
        }
        hasListeners() {
            return this.listeners.length > 0;
        }
        onSubscribe() {
            // Do nothing
        }
        onUnsubscribe() {
            // Do nothing
        }
    }

    // UTILS
    const isServer = typeof window === 'undefined';
    function noop() {
        return undefined;
    }
    function functionalUpdate(updater, input) {
        return typeof updater === 'function'
            ? updater(input)
            : updater;
    }
    function isValidTimeout(value) {
        return typeof value === 'number' && value >= 0 && value !== Infinity;
    }
    function ensureQueryKeyArray(value) {
        return (Array.isArray(value)
            ? value
            : [value]);
    }
    function timeUntilStale(updatedAt, staleTime) {
        return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
    }
    function parseQueryArgs(arg1, arg2, arg3) {
        if (!isQueryKey(arg1)) {
            return arg1;
        }
        if (typeof arg2 === 'function') {
            return Object.assign(Object.assign({}, arg3), { queryKey: arg1, queryFn: arg2 });
        }
        return Object.assign(Object.assign({}, arg2), { queryKey: arg1 });
    }
    function parseFilterArgs(arg1, arg2, arg3) {
        return (isQueryKey(arg1)
            ? [Object.assign(Object.assign({}, arg2), { queryKey: arg1 }), arg3]
            : [arg1 || {}, arg2]);
    }
    function mapQueryStatusFilter(active, inactive) {
        if ((active === true && inactive === true) ||
            (active == null && inactive == null)) {
            return 'all';
        }
        else if (active === false && inactive === false) {
            return 'none';
        }
        else {
            // At this point, active|inactive can only be true|false or false|true
            // so, when only one value is provided, the missing one has to be the negated value
            const isActive = active !== null && active !== void 0 ? active : !inactive;
            return isActive ? 'active' : 'inactive';
        }
    }
    function matchQuery(filters, query) {
        const { active, exact, fetching, inactive, predicate, queryKey, stale, } = filters;
        if (isQueryKey(queryKey)) {
            if (exact) {
                if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
                    return false;
                }
            }
            else if (!partialMatchKey(query.queryKey, queryKey)) {
                return false;
            }
        }
        const queryStatusFilter = mapQueryStatusFilter(active, inactive);
        if (queryStatusFilter === 'none') {
            return false;
        }
        else if (queryStatusFilter !== 'all') {
            const isActive = query.isActive();
            if (queryStatusFilter === 'active' && !isActive) {
                return false;
            }
            if (queryStatusFilter === 'inactive' && isActive) {
                return false;
            }
        }
        if (typeof stale === 'boolean' && query.isStale() !== stale) {
            return false;
        }
        if (typeof fetching === 'boolean' && query.isFetching() !== fetching) {
            return false;
        }
        if (predicate && !predicate(query)) {
            return false;
        }
        return true;
    }
    function matchMutation(filters, mutation) {
        const { exact, fetching, predicate, mutationKey } = filters;
        if (isQueryKey(mutationKey)) {
            if (!mutation.options.mutationKey) {
                return false;
            }
            if (exact) {
                if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
                    return false;
                }
            }
            else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
                return false;
            }
        }
        if (typeof fetching === 'boolean' &&
            (mutation.state.status === 'loading') !== fetching) {
            return false;
        }
        if (predicate && !predicate(mutation)) {
            return false;
        }
        return true;
    }
    function hashQueryKeyByOptions(queryKey, options) {
        const hashFn = (options === null || options === void 0 ? void 0 : options.queryKeyHashFn) || hashQueryKey;
        return hashFn(queryKey);
    }
    /**
     * Default query keys hash function.
     */
    function hashQueryKey(queryKey) {
        const asArray = ensureQueryKeyArray(queryKey);
        return stableValueHash(asArray);
    }
    /**
     * Hashes the value into a stable hash.
     */
    function stableValueHash(value) {
        return JSON.stringify(value, (_, val) => isPlainObject(val)
            ? Object.keys(val)
                .sort()
                .reduce((result, key) => {
                result[key] = val[key];
                return result;
            }, {})
            : val);
    }
    /**
     * Checks if key `b` partially matches with key `a`.
     */
    function partialMatchKey(a, b) {
        return partialDeepEqual(ensureQueryKeyArray(a), ensureQueryKeyArray(b));
    }
    /**
     * Checks if `b` partially matches with `a`.
     */
    function partialDeepEqual(a, b) {
        if (a === b) {
            return true;
        }
        if (typeof a !== typeof b) {
            return false;
        }
        if (a && b && typeof a === 'object' && typeof b === 'object') {
            return !Object.keys(b).some(key => !partialDeepEqual(a[key], b[key]));
        }
        return false;
    }
    function replaceEqualDeep(a, b) {
        if (a === b) {
            return a;
        }
        const array = Array.isArray(a) && Array.isArray(b);
        if (array || (isPlainObject(a) && isPlainObject(b))) {
            const aSize = array ? a.length : Object.keys(a).length;
            const bItems = array ? b : Object.keys(b);
            const bSize = bItems.length;
            const copy = array ? [] : {};
            let equalItems = 0;
            for (let i = 0; i < bSize; i++) {
                const key = array ? i : bItems[i];
                copy[key] = replaceEqualDeep(a[key], b[key]);
                if (copy[key] === a[key]) {
                    equalItems++;
                }
            }
            return aSize === bSize && equalItems === aSize ? a : copy;
        }
        return b;
    }
    /**
     * Shallow compare objects. Only works with objects that always have the same properties.
     */
    function shallowEqualObjects(a, b) {
        if ((a && !b) || (b && !a)) {
            return false;
        }
        for (const key in a) {
            if (a[key] !== b[key]) {
                return false;
            }
        }
        return true;
    }
    // Copied from: https://github.com/jonschlinkert/is-plain-object
    function isPlainObject(o) {
        if (!hasObjectPrototype(o)) {
            return false;
        }
        // If has modified constructor
        const ctor = o.constructor;
        if (typeof ctor === 'undefined') {
            return true;
        }
        // If has modified prototype
        const prot = ctor.prototype;
        if (!hasObjectPrototype(prot)) {
            return false;
        }
        // If constructor does not have an Object-specific method
        if (!prot.hasOwnProperty('isPrototypeOf')) {
            return false;
        }
        // Most likely a plain Object
        return true;
    }
    function hasObjectPrototype(o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }
    function isQueryKey(value) {
        return typeof value === 'string' || Array.isArray(value);
    }
    function sleep(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
    /**
     * Schedules a microtask.
     * This can be useful to schedule state updates after rendering.
     */
    function scheduleMicrotask(callback) {
        Promise.resolve()
            .then(callback)
            .catch(error => setTimeout(() => {
            throw error;
        }));
    }
    function getAbortController() {
        if (typeof AbortController === 'function') {
            return new AbortController();
        }
    }

    class FocusManager extends Subscribable {
        constructor() {
            super();
            this.setup = onFocus => {
                if (!isServer && (window === null || window === void 0 ? void 0 : window.addEventListener)) {
                    const listener = () => onFocus();
                    // Listen to visibillitychange and focus
                    window.addEventListener('visibilitychange', listener, false);
                    window.addEventListener('focus', listener, false);
                    return () => {
                        // Be sure to unsubscribe if a new handler is set
                        window.removeEventListener('visibilitychange', listener);
                        window.removeEventListener('focus', listener);
                    };
                }
            };
        }
        onSubscribe() {
            if (!this.cleanup) {
                this.setEventListener(this.setup);
            }
        }
        onUnsubscribe() {
            var _a;
            if (!this.hasListeners()) {
                (_a = this.cleanup) === null || _a === void 0 ? void 0 : _a.call(this);
                this.cleanup = undefined;
            }
        }
        setEventListener(setup) {
            var _a;
            this.setup = setup;
            (_a = this.cleanup) === null || _a === void 0 ? void 0 : _a.call(this);
            this.cleanup = setup(focused => {
                if (typeof focused === 'boolean') {
                    this.setFocused(focused);
                }
                else {
                    this.onFocus();
                }
            });
        }
        setFocused(focused) {
            this.focused = focused;
            if (focused) {
                this.onFocus();
            }
        }
        onFocus() {
            this.listeners.forEach(listener => {
                listener();
            });
        }
        isFocused() {
            if (typeof this.focused === 'boolean') {
                return this.focused;
            }
            // document global can be unavailable in react native
            if (typeof document === 'undefined') {
                return true;
            }
            return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
        }
    }
    const focusManager = new FocusManager();

    class OnlineManager extends Subscribable {
        constructor() {
            super();
            this.setup = onOnline => {
                if (!isServer && (window === null || window === void 0 ? void 0 : window.addEventListener)) {
                    const listener = () => onOnline();
                    // Listen to online
                    window.addEventListener('online', listener, false);
                    window.addEventListener('offline', listener, false);
                    return () => {
                        // Be sure to unsubscribe if a new handler is set
                        window.removeEventListener('online', listener);
                        window.removeEventListener('offline', listener);
                    };
                }
            };
        }
        onSubscribe() {
            if (!this.cleanup) {
                this.setEventListener(this.setup);
            }
        }
        onUnsubscribe() {
            var _a;
            if (!this.hasListeners()) {
                (_a = this.cleanup) === null || _a === void 0 ? void 0 : _a.call(this);
                this.cleanup = undefined;
            }
        }
        setEventListener(setup) {
            var _a;
            this.setup = setup;
            (_a = this.cleanup) === null || _a === void 0 ? void 0 : _a.call(this);
            this.cleanup = setup((online) => {
                if (typeof online === 'boolean') {
                    this.setOnline(online);
                }
                else {
                    this.onOnline();
                }
            });
        }
        setOnline(online) {
            this.online = online;
            if (online) {
                this.onOnline();
            }
        }
        onOnline() {
            this.listeners.forEach(listener => {
                listener();
            });
        }
        isOnline() {
            if (typeof this.online === 'boolean') {
                return this.online;
            }
            if (typeof navigator === 'undefined' ||
                typeof navigator.onLine === 'undefined') {
                return true;
            }
            return navigator.onLine;
        }
    }
    const onlineManager = new OnlineManager();

    function defaultRetryDelay(failureCount) {
        return Math.min(1000 * 2 ** failureCount, 30000);
    }
    function isCancelable(value) {
        return typeof (value === null || value === void 0 ? void 0 : value.cancel) === 'function';
    }
    class CancelledError {
        constructor(options) {
            this.revert = options === null || options === void 0 ? void 0 : options.revert;
            this.silent = options === null || options === void 0 ? void 0 : options.silent;
        }
    }
    function isCancelledError(value) {
        return value instanceof CancelledError;
    }
    // CLASS
    class Retryer {
        constructor(config) {
            let cancelRetry = false;
            let cancelFn;
            let continueFn;
            let promiseResolve;
            let promiseReject;
            this.abort = config.abort;
            this.cancel = cancelOptions => cancelFn === null || cancelFn === void 0 ? void 0 : cancelFn(cancelOptions);
            this.cancelRetry = () => {
                cancelRetry = true;
            };
            this.continueRetry = () => {
                cancelRetry = false;
            };
            this.continue = () => continueFn === null || continueFn === void 0 ? void 0 : continueFn();
            this.failureCount = 0;
            this.isPaused = false;
            this.isResolved = false;
            this.isTransportCancelable = false;
            this.promise = new Promise((outerResolve, outerReject) => {
                promiseResolve = outerResolve;
                promiseReject = outerReject;
            });
            const resolve = (value) => {
                var _a;
                if (!this.isResolved) {
                    this.isResolved = true;
                    (_a = config.onSuccess) === null || _a === void 0 ? void 0 : _a.call(config, value);
                    continueFn === null || continueFn === void 0 ? void 0 : continueFn();
                    promiseResolve(value);
                }
            };
            const reject = (value) => {
                var _a;
                if (!this.isResolved) {
                    this.isResolved = true;
                    (_a = config.onError) === null || _a === void 0 ? void 0 : _a.call(config, value);
                    continueFn === null || continueFn === void 0 ? void 0 : continueFn();
                    promiseReject(value);
                }
            };
            const pause = () => {
                return new Promise(continueResolve => {
                    var _a;
                    continueFn = continueResolve;
                    this.isPaused = true;
                    (_a = config.onPause) === null || _a === void 0 ? void 0 : _a.call(config);
                }).then(() => {
                    var _a;
                    continueFn = undefined;
                    this.isPaused = false;
                    (_a = config.onContinue) === null || _a === void 0 ? void 0 : _a.call(config);
                });
            };
            // Create loop function
            const run = () => {
                // Do nothing if already resolved
                if (this.isResolved) {
                    return;
                }
                let promiseOrValue;
                // Execute query
                try {
                    promiseOrValue = config.fn();
                }
                catch (error) {
                    promiseOrValue = Promise.reject(error);
                }
                // Create callback to cancel this fetch
                cancelFn = cancelOptions => {
                    var _a;
                    if (!this.isResolved) {
                        reject(new CancelledError(cancelOptions));
                        (_a = this.abort) === null || _a === void 0 ? void 0 : _a.call(this);
                        // Cancel transport if supported
                        if (isCancelable(promiseOrValue)) {
                            try {
                                promiseOrValue.cancel();
                            }
                            catch (_b) { }
                        }
                    }
                };
                // Check if the transport layer support cancellation
                this.isTransportCancelable = isCancelable(promiseOrValue);
                Promise.resolve(promiseOrValue)
                    .then(resolve)
                    .catch(error => {
                    var _a, _b, _c;
                    // Stop if the fetch is already resolved
                    if (this.isResolved) {
                        return;
                    }
                    // Do we need to retry the request?
                    const retry = (_a = config.retry) !== null && _a !== void 0 ? _a : 3;
                    const retryDelay = (_b = config.retryDelay) !== null && _b !== void 0 ? _b : defaultRetryDelay;
                    const delay = typeof retryDelay === 'function'
                        ? retryDelay(this.failureCount, error)
                        : retryDelay;
                    const shouldRetry = retry === true ||
                        (typeof retry === 'number' && this.failureCount < retry) ||
                        (typeof retry === 'function' && retry(this.failureCount, error));
                    if (cancelRetry || !shouldRetry) {
                        // We are done if the query does not need to be retried
                        reject(error);
                        return;
                    }
                    this.failureCount++;
                    // Notify on fail
                    (_c = config.onFail) === null || _c === void 0 ? void 0 : _c.call(config, this.failureCount, error);
                    // Delay
                    sleep(delay)
                        // Pause if the document is not visible or when the device is offline
                        .then(() => {
                        if (!focusManager.isFocused() || !onlineManager.isOnline()) {
                            return pause();
                        }
                    })
                        .then(() => {
                        if (cancelRetry) {
                            reject(error);
                        }
                        else {
                            run();
                        }
                    });
                });
            };
            // Start loop
            run();
        }
    }

    // CLASS
    class NotifyManager {
        constructor() {
            this.queue = [];
            this.transactions = 0;
            this.notifyFn = (callback) => {
                callback();
            };
            this.batchNotifyFn = (callback) => {
                callback();
            };
        }
        batch(callback) {
            let result;
            this.transactions++;
            try {
                result = callback();
            }
            finally {
                this.transactions--;
                if (!this.transactions) {
                    this.flush();
                }
            }
            return result;
        }
        schedule(callback) {
            if (this.transactions) {
                this.queue.push(callback);
            }
            else {
                scheduleMicrotask(() => {
                    this.notifyFn(callback);
                });
            }
        }
        /**
         * All calls to the wrapped function will be batched.
         */
        batchCalls(callback) {
            return ((...args) => {
                this.schedule(() => {
                    callback(...args);
                });
            });
        }
        flush() {
            const queue = this.queue;
            this.queue = [];
            if (queue.length) {
                scheduleMicrotask(() => {
                    this.batchNotifyFn(() => {
                        queue.forEach(callback => {
                            this.notifyFn(callback);
                        });
                    });
                });
            }
        }
        /**
         * Use this method to set a custom notify function.
         * This can be used to for example wrap notifications with `React.act` while running tests.
         */
        setNotifyFunction(fn) {
            this.notifyFn = fn;
        }
        /**
         * Use this method to set a custom function to batch notifications together into a single tick.
         * By default React Query will use the batch function provided by ReactDOM or React Native.
         */
        setBatchNotifyFunction(fn) {
            this.batchNotifyFn = fn;
        }
    }
    // SINGLETON
    const notifyManager = new NotifyManager();

    // TYPES
    // FUNCTIONS
    let logger = console;
    function getLogger() {
        return logger;
    }

    // CLASS
    class Query {
        constructor(config) {
            this.abortSignalConsumed = false;
            this.hadObservers = false;
            this.defaultOptions = config.defaultOptions;
            this.setOptions(config.options);
            this.observers = [];
            this.cache = config.cache;
            this.queryKey = config.queryKey;
            this.queryHash = config.queryHash;
            this.initialState = config.state || this.getDefaultState(this.options);
            this.state = this.initialState;
            this.meta = config.meta;
            this.scheduleGc();
        }
        setOptions(options) {
            var _a;
            this.options = Object.assign(Object.assign({}, this.defaultOptions), options);
            this.meta = options === null || options === void 0 ? void 0 : options.meta;
            // Default to 5 minutes if not cache time is set
            this.cacheTime = Math.max(this.cacheTime || 0, (_a = this.options.cacheTime) !== null && _a !== void 0 ? _a : 5 * 60 * 1000);
        }
        setDefaultOptions(options) {
            this.defaultOptions = options;
        }
        scheduleGc() {
            this.clearGcTimeout();
            if (isValidTimeout(this.cacheTime)) {
                // @ts-ignore
                this.gcTimeout = setTimeout(() => {
                    this.optionalRemove();
                }, this.cacheTime);
            }
        }
        clearGcTimeout() {
            clearTimeout(this.gcTimeout);
            this.gcTimeout = undefined;
        }
        optionalRemove() {
            if (!this.observers.length) {
                if (this.state.isFetching) {
                    if (this.hadObservers) {
                        this.scheduleGc();
                    }
                }
                else {
                    this.cache.remove(this);
                }
            }
        }
        setData(updater, options) {
            var _a, _b;
            const prevData = this.state.data;
            // Get the new data
            let data = functionalUpdate(updater, prevData);
            // Use prev data if an isDataEqual function is defined and returns `true`
            if ((_b = (_a = this.options).isDataEqual) === null || _b === void 0 ? void 0 : _b.call(_a, prevData, data)) {
                data = prevData;
            }
            else if (this.options.structuralSharing !== false) {
                // Structurally share data between prev and new data if needed
                data = replaceEqualDeep(prevData, data);
            }
            // Set data and mark it as cached
            this.dispatch({
                data,
                type: 'success',
                dataUpdatedAt: options === null || options === void 0 ? void 0 : options.updatedAt,
            });
            return data;
        }
        setState(state, setStateOptions) {
            this.dispatch({ type: 'setState', state, setStateOptions });
        }
        cancel(options) {
            var _a;
            const promise = this.promise;
            (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.cancel(options);
            return promise ? promise.then(noop).catch(noop) : Promise.resolve();
        }
        destroy() {
            this.clearGcTimeout();
            this.cancel({ silent: true });
        }
        reset() {
            this.destroy();
            this.setState(this.initialState);
        }
        isActive() {
            return this.observers.some(observer => observer.options.enabled !== false);
        }
        isFetching() {
            return this.state.isFetching;
        }
        isStale() {
            return (this.state.isInvalidated ||
                !this.state.dataUpdatedAt ||
                this.observers.some(observer => observer.getCurrentResult().isStale));
        }
        isStaleByTime(staleTime = 0) {
            return (this.state.isInvalidated ||
                !this.state.dataUpdatedAt ||
                !timeUntilStale(this.state.dataUpdatedAt, staleTime));
        }
        onFocus() {
            var _a;
            const observer = this.observers.find(x => x.shouldFetchOnWindowFocus());
            if (observer) {
                observer.refetch();
            }
            // Continue fetch if currently paused
            (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.continue();
        }
        onOnline() {
            var _a;
            const observer = this.observers.find(x => x.shouldFetchOnReconnect());
            if (observer) {
                observer.refetch();
            }
            // Continue fetch if currently paused
            (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.continue();
        }
        addObserver(observer) {
            if (this.observers.indexOf(observer) === -1) {
                this.observers.push(observer);
                this.hadObservers = true;
                // Stop the query from being garbage collected
                this.clearGcTimeout();
                this.cache.notify({ type: 'observerAdded', query: this, observer });
            }
        }
        removeObserver(observer) {
            if (this.observers.indexOf(observer) !== -1) {
                this.observers = this.observers.filter(x => x !== observer);
                if (!this.observers.length) {
                    // If the transport layer does not support cancellation
                    // we'll let the query continue so the result can be cached
                    if (this.retryer) {
                        if (this.retryer.isTransportCancelable || this.abortSignalConsumed) {
                            this.retryer.cancel({ revert: true });
                        }
                        else {
                            this.retryer.cancelRetry();
                        }
                    }
                    if (this.cacheTime) {
                        this.scheduleGc();
                    }
                    else {
                        this.cache.remove(this);
                    }
                }
                this.cache.notify({ type: 'observerRemoved', query: this, observer });
            }
        }
        getObserversCount() {
            return this.observers.length;
        }
        invalidate() {
            if (!this.state.isInvalidated) {
                this.dispatch({ type: 'invalidate' });
            }
        }
        fetch(options, fetchOptions) {
            var _a, _b, _c, _d, _e, _f;
            if (this.state.isFetching) {
                if (this.state.dataUpdatedAt && (fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.cancelRefetch)) {
                    // Silently cancel current fetch if the user wants to cancel refetches
                    this.cancel({ silent: true });
                }
                else if (this.promise) {
                    // make sure that retries that were potentially cancelled due to unmounts can continue
                    (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.continueRetry();
                    // Return current promise if we are already fetching
                    return this.promise;
                }
            }
            // Update config if passed, otherwise the config from the last execution is used
            if (options) {
                this.setOptions(options);
            }
            // Use the options from the first observer with a query function if no function is found.
            // This can happen when the query is hydrated or created with setQueryData.
            if (!this.options.queryFn) {
                const observer = this.observers.find(x => x.options.queryFn);
                if (observer) {
                    this.setOptions(observer.options);
                }
            }
            const queryKey = ensureQueryKeyArray(this.queryKey);
            const abortController = getAbortController();
            // Create query function context
            const queryFnContext = {
                queryKey,
                pageParam: undefined,
                meta: this.meta,
            };
            Object.defineProperty(queryFnContext, 'signal', {
                enumerable: true,
                get: () => {
                    if (abortController) {
                        this.abortSignalConsumed = true;
                        return abortController.signal;
                    }
                    return undefined;
                },
            });
            // Create fetch function
            const fetchFn = () => {
                if (!this.options.queryFn) {
                    return Promise.reject('Missing queryFn');
                }
                this.abortSignalConsumed = false;
                return this.options.queryFn(queryFnContext);
            };
            // Trigger behavior hook
            const context = {
                fetchOptions,
                options: this.options,
                queryKey: queryKey,
                state: this.state,
                fetchFn,
                meta: this.meta,
            };
            if ((_b = this.options.behavior) === null || _b === void 0 ? void 0 : _b.onFetch) {
                (_c = this.options.behavior) === null || _c === void 0 ? void 0 : _c.onFetch(context);
            }
            // Store state in case the current fetch needs to be reverted
            this.revertState = this.state;
            // Set to fetching state if not already in it
            if (!this.state.isFetching ||
                this.state.fetchMeta !== ((_d = context.fetchOptions) === null || _d === void 0 ? void 0 : _d.meta)) {
                this.dispatch({ type: 'fetch', meta: (_e = context.fetchOptions) === null || _e === void 0 ? void 0 : _e.meta });
            }
            // Try to fetch the data
            this.retryer = new Retryer({
                fn: context.fetchFn,
                abort: (_f = abortController === null || abortController === void 0 ? void 0 : abortController.abort) === null || _f === void 0 ? void 0 : _f.bind(abortController),
                onSuccess: data => {
                    var _a, _b;
                    this.setData(data);
                    // Notify cache callback
                    (_b = (_a = this.cache.config).onSuccess) === null || _b === void 0 ? void 0 : _b.call(_a, data, this);
                    // Remove query after fetching if cache time is 0
                    if (this.cacheTime === 0) {
                        this.optionalRemove();
                    }
                },
                onError: (error) => {
                    var _a, _b;
                    // Optimistically update state if needed
                    if (!(isCancelledError(error) && error.silent)) {
                        this.dispatch({
                            type: 'error',
                            error: error,
                        });
                    }
                    if (!isCancelledError(error)) {
                        // Notify cache callback
                        (_b = (_a = this.cache.config).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, this);
                        // Log error
                        getLogger().error(error);
                    }
                    // Remove query after fetching if cache time is 0
                    if (this.cacheTime === 0) {
                        this.optionalRemove();
                    }
                },
                onFail: () => {
                    this.dispatch({ type: 'failed' });
                },
                onPause: () => {
                    this.dispatch({ type: 'pause' });
                },
                onContinue: () => {
                    this.dispatch({ type: 'continue' });
                },
                retry: context.options.retry,
                retryDelay: context.options.retryDelay,
            });
            this.promise = this.retryer.promise;
            return this.promise;
        }
        dispatch(action) {
            this.state = this.reducer(this.state, action);
            notifyManager.batch(() => {
                this.observers.forEach(observer => {
                    observer.onQueryUpdate(action);
                });
                this.cache.notify({ query: this, type: 'queryUpdated', action });
            });
        }
        getDefaultState(options) {
            const data = typeof options.initialData === 'function'
                ? options.initialData()
                : options.initialData;
            const hasInitialData = typeof options.initialData !== 'undefined';
            const initialDataUpdatedAt = hasInitialData
                ? typeof options.initialDataUpdatedAt === 'function'
                    ? options.initialDataUpdatedAt()
                    : options.initialDataUpdatedAt
                : 0;
            const hasData = typeof data !== 'undefined';
            return {
                data,
                dataUpdateCount: 0,
                dataUpdatedAt: hasData ? initialDataUpdatedAt !== null && initialDataUpdatedAt !== void 0 ? initialDataUpdatedAt : Date.now() : 0,
                error: null,
                errorUpdateCount: 0,
                errorUpdatedAt: 0,
                fetchFailureCount: 0,
                fetchMeta: null,
                isFetching: false,
                isInvalidated: false,
                isPaused: false,
                status: hasData ? 'success' : 'idle',
            };
        }
        reducer(state, action) {
            var _a, _b;
            switch (action.type) {
                case 'failed':
                    return Object.assign(Object.assign({}, state), { fetchFailureCount: state.fetchFailureCount + 1 });
                case 'pause':
                    return Object.assign(Object.assign({}, state), { isPaused: true });
                case 'continue':
                    return Object.assign(Object.assign({}, state), { isPaused: false });
                case 'fetch':
                    return Object.assign(Object.assign(Object.assign({}, state), { fetchFailureCount: 0, fetchMeta: (_a = action.meta) !== null && _a !== void 0 ? _a : null, isFetching: true, isPaused: false }), (!state.dataUpdatedAt && {
                        error: null,
                        status: 'loading',
                    }));
                case 'success':
                    return Object.assign(Object.assign({}, state), { data: action.data, dataUpdateCount: state.dataUpdateCount + 1, dataUpdatedAt: (_b = action.dataUpdatedAt) !== null && _b !== void 0 ? _b : Date.now(), error: null, fetchFailureCount: 0, isFetching: false, isInvalidated: false, isPaused: false, status: 'success' });
                case 'error':
                    const error = action.error;
                    if (isCancelledError(error) && error.revert && this.revertState) {
                        return Object.assign({}, this.revertState);
                    }
                    return Object.assign(Object.assign({}, state), { error: error, errorUpdateCount: state.errorUpdateCount + 1, errorUpdatedAt: Date.now(), fetchFailureCount: state.fetchFailureCount + 1, isFetching: false, isPaused: false, status: 'error' });
                case 'invalidate':
                    return Object.assign(Object.assign({}, state), { isInvalidated: true });
                case 'setState':
                    return Object.assign(Object.assign({}, state), action.state);
                default:
                    return state;
            }
        }
    }

    class QueryObserver extends Subscribable {
        constructor(client, options) {
            super();
            this.client = client;
            this.options = options;
            this.trackedProps = [];
            this.previousSelectError = null;
            this.bindMethods();
            this.setOptions(options);
        }
        bindMethods() {
            this.remove = this.remove.bind(this);
            this.refetch = this.refetch.bind(this);
        }
        onSubscribe() {
            if (this.listeners.length === 1) {
                this.currentQuery.addObserver(this);
                if (shouldFetchOnMount(this.currentQuery, this.options)) {
                    this.executeFetch();
                }
                this.updateTimers();
            }
        }
        onUnsubscribe() {
            if (!this.listeners.length) {
                this.destroy();
            }
        }
        shouldFetchOnReconnect() {
            return shouldFetchOnReconnect(this.currentQuery, this.options);
        }
        shouldFetchOnWindowFocus() {
            return shouldFetchOnWindowFocus(this.currentQuery, this.options);
        }
        destroy() {
            this.listeners = [];
            this.clearTimers();
            this.currentQuery.removeObserver(this);
        }
        setOptions(options, notifyOptions) {
            const prevOptions = this.options;
            const prevQuery = this.currentQuery;
            this.options = this.client.defaultQueryObserverOptions(options);
            if (typeof this.options.enabled !== 'undefined' &&
                typeof this.options.enabled !== 'boolean') {
                throw new Error('Expected enabled to be a boolean');
            }
            // Keep previous query key if the user does not supply one
            if (!this.options.queryKey) {
                this.options.queryKey = prevOptions.queryKey;
            }
            this.updateQuery();
            const mounted = this.hasListeners();
            // Fetch if there are subscribers
            if (mounted &&
                shouldFetchOptionally(this.currentQuery, prevQuery, this.options, prevOptions)) {
                this.executeFetch();
            }
            // Update result
            this.updateResult(notifyOptions);
            // Update stale interval if needed
            if (mounted &&
                (this.currentQuery !== prevQuery ||
                    this.options.enabled !== prevOptions.enabled ||
                    this.options.staleTime !== prevOptions.staleTime)) {
                this.updateStaleTimeout();
            }
            const nextRefetchInterval = this.computeRefetchInterval();
            // Update refetch interval if needed
            if (mounted &&
                (this.currentQuery !== prevQuery ||
                    this.options.enabled !== prevOptions.enabled ||
                    nextRefetchInterval !== this.currentRefetchInterval)) {
                this.updateRefetchInterval(nextRefetchInterval);
            }
        }
        updateOptions(options, notifyOptions) {
            const mergedOptions = Object.assign(Object.assign({}, this.options), options);
            if (options.queryKey && !options.queryHash && options.queryKey !== this.options.queryKey) {
                mergedOptions.queryHash = hashQueryKeyByOptions(options.queryKey, mergedOptions);
            }
            this.setOptions(mergedOptions, notifyOptions);
        }
        getOptimisticResult(options) {
            const defaultedOptions = this.client.defaultQueryObserverOptions(options);
            const query = this.client
                .getQueryCache()
                .build(this.client, defaultedOptions);
            return this.createResult(query, defaultedOptions);
        }
        getCurrentResult() {
            return this.currentResult;
        }
        trackResult(result, defaultedOptions) {
            const trackedResult = {};
            const trackProp = (key) => {
                if (!this.trackedProps.includes(key)) {
                    this.trackedProps.push(key);
                }
            };
            Object.keys(result).forEach(key => {
                Object.defineProperty(trackedResult, key, {
                    configurable: false,
                    enumerable: true,
                    get: () => {
                        trackProp(key);
                        return result[key];
                    },
                });
            });
            if (defaultedOptions.useErrorBoundary || defaultedOptions.suspense) {
                trackProp('error');
            }
            return trackedResult;
        }
        getNextResult(options) {
            return new Promise((resolve, reject) => {
                const unsubscribe = this.subscribe(result => {
                    if (!result.isFetching) {
                        unsubscribe();
                        if (result.isError && (options === null || options === void 0 ? void 0 : options.throwOnError)) {
                            reject(result.error);
                        }
                        else {
                            resolve(result);
                        }
                    }
                });
            });
        }
        getCurrentQuery() {
            return this.currentQuery;
        }
        remove() {
            this.client.getQueryCache().remove(this.currentQuery);
        }
        refetch(options) {
            return this.fetch(Object.assign(Object.assign({}, options), { meta: { refetchPage: options === null || options === void 0 ? void 0 : options.refetchPage } }));
        }
        fetchOptimistic(options) {
            const defaultedOptions = this.client.defaultQueryObserverOptions(options);
            const query = this.client
                .getQueryCache()
                .build(this.client, defaultedOptions);
            return query.fetch().then(() => this.createResult(query, defaultedOptions));
        }
        fetch(fetchOptions) {
            return this.executeFetch(fetchOptions).then(() => {
                this.updateResult();
                return this.currentResult;
            });
        }
        executeFetch(fetchOptions) {
            // Make sure we reference the latest query as the current one might have been removed
            this.updateQuery();
            // Fetch
            let promise = this.currentQuery.fetch(this.options, fetchOptions);
            if (!(fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.throwOnError)) {
                promise = promise.catch(noop);
            }
            return promise;
        }
        updateStaleTimeout() {
            this.clearStaleTimeout();
            if (isServer ||
                this.currentResult.isStale ||
                !isValidTimeout(this.options.staleTime)) {
                return;
            }
            const time = timeUntilStale(this.currentResult.dataUpdatedAt, this.options.staleTime);
            // The timeout is sometimes triggered 1 ms before the stale time expiration.
            // To mitigate this issue we always add 1 ms to the timeout.
            const timeout = time + 1;
            // @ts-ignore
            this.staleTimeoutId = setTimeout(() => {
                if (!this.currentResult.isStale) {
                    this.updateResult();
                }
            }, timeout);
        }
        computeRefetchInterval() {
            var _a;
            return typeof this.options.refetchInterval === 'function'
                ? this.options.refetchInterval(this.currentResult.data, this.currentQuery)
                : (_a = this.options.refetchInterval) !== null && _a !== void 0 ? _a : false;
        }
        updateRefetchInterval(nextInterval) {
            this.clearRefetchInterval();
            this.currentRefetchInterval = nextInterval;
            if (isServer ||
                this.options.enabled === false ||
                !isValidTimeout(this.currentRefetchInterval) ||
                this.currentRefetchInterval === 0) {
                return;
            }
            // @ts-ignore
            this.refetchIntervalId = setInterval(() => {
                if (this.options.refetchIntervalInBackground ||
                    focusManager.isFocused()) {
                    this.executeFetch();
                }
            }, this.currentRefetchInterval);
        }
        updateTimers() {
            this.updateStaleTimeout();
            this.updateRefetchInterval(this.computeRefetchInterval());
        }
        clearTimers() {
            this.clearStaleTimeout();
            this.clearRefetchInterval();
        }
        clearStaleTimeout() {
            clearTimeout(this.staleTimeoutId);
            this.staleTimeoutId = undefined;
        }
        clearRefetchInterval() {
            clearInterval(this.refetchIntervalId);
            this.refetchIntervalId = undefined;
        }
        createResult(query, options) {
            var _a;
            const prevQuery = this.currentQuery;
            const prevOptions = this.options;
            const prevResult = this.currentResult;
            const prevResultState = this.currentResultState;
            const prevResultOptions = this.currentResultOptions;
            const queryChange = query !== prevQuery;
            const queryInitialState = queryChange
                ? query.state
                : this.currentQueryInitialState;
            const prevQueryResult = queryChange
                ? this.currentResult
                : this.previousQueryResult;
            const { state } = query;
            let { dataUpdatedAt, error, errorUpdatedAt, isFetching, status } = state;
            let isPreviousData = false;
            let isPlaceholderData = false;
            let data;
            // Optimistically set result in fetching state if needed
            // @ts-ignore
            if (options.optimisticResults) {
                const mounted = this.hasListeners();
                const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
                const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
                if (fetchOnMount || fetchOptionally) {
                    isFetching = true;
                    if (!dataUpdatedAt) {
                        status = 'loading';
                    }
                }
            }
            // Keep previous data if needed
            if (options.keepPreviousData &&
                !state.dataUpdateCount && (prevQueryResult === null || prevQueryResult === void 0 ? void 0 : prevQueryResult.isSuccess) &&
                status !== 'error') {
                data = prevQueryResult.data;
                dataUpdatedAt = prevQueryResult.dataUpdatedAt;
                status = prevQueryResult.status;
                isPreviousData = true;
            }
            // Select data if needed
            else if (options.select && typeof state.data !== 'undefined') {
                // Memoize select result
                if (prevResult &&
                    state.data === (prevResultState === null || prevResultState === void 0 ? void 0 : prevResultState.data) &&
                    options.select === ((_a = this.previousSelect) === null || _a === void 0 ? void 0 : _a.fn) &&
                    !this.previousSelectError) {
                    data = this.previousSelect.result;
                }
                else {
                    try {
                        data = options.select(state.data);
                        if (options.structuralSharing !== false) {
                            data = replaceEqualDeep(prevResult === null || prevResult === void 0 ? void 0 : prevResult.data, data);
                        }
                        this.previousSelect = {
                            fn: options.select,
                            result: data,
                        };
                        this.previousSelectError = null;
                    }
                    catch (selectError) {
                        getLogger().error(selectError);
                        error = selectError;
                        this.previousSelectError = selectError;
                        errorUpdatedAt = Date.now();
                        status = 'error';
                    }
                }
            }
            // Use query data
            else {
                data = state.data;
            }
            // Show placeholder data if needed
            if (typeof options.placeholderData !== 'undefined' &&
                typeof data === 'undefined' &&
                (status === 'loading' || status === 'idle')) {
                let placeholderData;
                // Memoize placeholder data
                if ((prevResult === null || prevResult === void 0 ? void 0 : prevResult.isPlaceholderData) &&
                    options.placeholderData === (prevResultOptions === null || prevResultOptions === void 0 ? void 0 : prevResultOptions.placeholderData)) {
                    placeholderData = prevResult.data;
                }
                else {
                    placeholderData =
                        typeof options.placeholderData === 'function'
                            ? options.placeholderData()
                            : options.placeholderData;
                    if (options.select && typeof placeholderData !== 'undefined') {
                        try {
                            placeholderData = options.select(placeholderData);
                            if (options.structuralSharing !== false) {
                                placeholderData = replaceEqualDeep(prevResult === null || prevResult === void 0 ? void 0 : prevResult.data, placeholderData);
                            }
                            this.previousSelectError = null;
                        }
                        catch (selectError) {
                            getLogger().error(selectError);
                            error = selectError;
                            this.previousSelectError = selectError;
                            errorUpdatedAt = Date.now();
                            status = 'error';
                        }
                    }
                }
                if (typeof placeholderData !== 'undefined') {
                    status = 'success';
                    data = placeholderData;
                    isPlaceholderData = true;
                }
            }
            const result = {
                status,
                isLoading: status === 'loading',
                isSuccess: status === 'success',
                isError: status === 'error',
                isIdle: status === 'idle',
                data,
                dataUpdatedAt,
                error,
                errorUpdatedAt,
                failureCount: state.fetchFailureCount,
                isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
                isFetchedAfterMount: state.dataUpdateCount > queryInitialState.dataUpdateCount ||
                    state.errorUpdateCount > queryInitialState.errorUpdateCount,
                isFetching,
                isRefetching: isFetching && status !== 'loading',
                isLoadingError: status === 'error' && state.dataUpdatedAt === 0,
                isPlaceholderData,
                isPreviousData,
                isRefetchError: status === 'error' && state.dataUpdatedAt !== 0,
                isStale: isStale(query, options),
                refetch: this.refetch,
                remove: this.remove,
            };
            return result;
        }
        shouldNotifyListeners(result, prevResult) {
            if (!prevResult) {
                return true;
            }
            const { notifyOnChangeProps, notifyOnChangePropsExclusions } = this.options;
            if (!notifyOnChangeProps && !notifyOnChangePropsExclusions) {
                return true;
            }
            if (notifyOnChangeProps === 'tracked' && !this.trackedProps.length) {
                return true;
            }
            const includedProps = notifyOnChangeProps === 'tracked'
                ? this.trackedProps
                : notifyOnChangeProps;
            return Object.keys(result).some(key => {
                const typedKey = key;
                const changed = result[typedKey] !== prevResult[typedKey];
                const isIncluded = includedProps === null || includedProps === void 0 ? void 0 : includedProps.some(x => x === key);
                const isExcluded = notifyOnChangePropsExclusions === null || notifyOnChangePropsExclusions === void 0 ? void 0 : notifyOnChangePropsExclusions.some(x => x === key);
                return changed && !isExcluded && (!includedProps || isIncluded);
            });
        }
        updateResult(notifyOptions) {
            const prevResult = this.currentResult;
            this.currentResult = this.createResult(this.currentQuery, this.options);
            this.currentResultState = this.currentQuery.state;
            this.currentResultOptions = this.options;
            // Only notify if something has changed
            if (shallowEqualObjects(this.currentResult, prevResult)) {
                return;
            }
            // Determine which callbacks to trigger
            const defaultNotifyOptions = { cache: true };
            if ((notifyOptions === null || notifyOptions === void 0 ? void 0 : notifyOptions.listeners) !== false &&
                this.shouldNotifyListeners(this.currentResult, prevResult)) {
                defaultNotifyOptions.listeners = true;
            }
            this.notify(Object.assign(Object.assign({}, defaultNotifyOptions), notifyOptions));
        }
        updateQuery() {
            const query = this.client
                .getQueryCache()
                .build(this.client, this.options);
            if (query === this.currentQuery) {
                return;
            }
            const prevQuery = this.currentQuery;
            this.currentQuery = query;
            this.currentQueryInitialState = query.state;
            this.previousQueryResult = this.currentResult;
            if (this.hasListeners()) {
                prevQuery === null || prevQuery === void 0 ? void 0 : prevQuery.removeObserver(this);
                query.addObserver(this);
            }
        }
        onQueryUpdate(action) {
            const notifyOptions = {};
            if (action.type === 'success') {
                notifyOptions.onSuccess = true;
            }
            else if (action.type === 'error' && !isCancelledError(action.error)) {
                notifyOptions.onError = true;
            }
            this.updateResult(notifyOptions);
            if (this.hasListeners()) {
                this.updateTimers();
            }
        }
        notify(notifyOptions) {
            notifyManager.batch(() => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                // First trigger the configuration callbacks
                if (notifyOptions.onSuccess) {
                    (_b = (_a = this.options).onSuccess) === null || _b === void 0 ? void 0 : _b.call(_a, this.currentResult.data);
                    (_d = (_c = this.options).onSettled) === null || _d === void 0 ? void 0 : _d.call(_c, this.currentResult.data, null);
                }
                else if (notifyOptions.onError) {
                    (_f = (_e = this.options).onError) === null || _f === void 0 ? void 0 : _f.call(_e, this.currentResult.error);
                    (_h = (_g = this.options).onSettled) === null || _h === void 0 ? void 0 : _h.call(_g, undefined, this.currentResult.error);
                }
                // Then trigger the listeners
                if (notifyOptions.listeners) {
                    this.listeners.forEach(listener => {
                        listener(this.currentResult);
                    });
                }
                // Then the cache listeners
                if (notifyOptions.cache) {
                    this.client
                        .getQueryCache()
                        .notify({ query: this.currentQuery, type: 'observerResultsUpdated' });
                }
            });
        }
    }
    function shouldLoadOnMount(query, options) {
        return (options.enabled !== false &&
            !query.state.dataUpdatedAt &&
            !(query.state.status === 'error' && options.retryOnMount === false));
    }
    function shouldRefetchOnMount(query, options) {
        return (options.enabled !== false &&
            query.state.dataUpdatedAt > 0 &&
            (options.refetchOnMount === 'always' ||
                (options.refetchOnMount !== false && isStale(query, options))));
    }
    function shouldFetchOnMount(query, options) {
        return (shouldLoadOnMount(query, options) || shouldRefetchOnMount(query, options));
    }
    function shouldFetchOnReconnect(query, options) {
        return (options.enabled !== false &&
            (options.refetchOnReconnect === 'always' ||
                (options.refetchOnReconnect !== false && isStale(query, options))));
    }
    function shouldFetchOnWindowFocus(query, options) {
        return (options.enabled !== false &&
            (options.refetchOnWindowFocus === 'always' ||
                (options.refetchOnWindowFocus !== false && isStale(query, options))));
    }
    function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
        return (options.enabled !== false &&
            (query !== prevQuery || prevOptions.enabled === false) &&
            (!options.suspense || query.state.status !== 'error') &&
            isStale(query, options));
    }
    function isStale(query, options) {
        return query.isStaleByTime(options.staleTime);
    }

    // CLASS
    class QueryCache extends Subscribable {
        constructor(config) {
            super();
            this.config = config || {};
            this.queries = [];
            this.queriesMap = {};
        }
        build(client, options, state) {
            var _a;
            const queryKey = options.queryKey;
            const queryHash = (_a = options.queryHash) !== null && _a !== void 0 ? _a : hashQueryKeyByOptions(queryKey, options);
            let query = this.get(queryHash);
            if (!query) {
                query = new Query({
                    cache: this,
                    queryKey,
                    queryHash,
                    options: client.defaultQueryOptions(options),
                    state,
                    defaultOptions: client.getQueryDefaults(queryKey),
                    meta: options.meta,
                });
                this.add(query);
            }
            return query;
        }
        add(query) {
            if (!this.queriesMap[query.queryHash]) {
                this.queriesMap[query.queryHash] = query;
                this.queries.push(query);
                this.notify({
                    type: 'queryAdded',
                    query,
                });
            }
        }
        remove(query) {
            const queryInMap = this.queriesMap[query.queryHash];
            if (queryInMap) {
                query.destroy();
                this.queries = this.queries.filter(x => x !== query);
                if (queryInMap === query) {
                    delete this.queriesMap[query.queryHash];
                }
                this.notify({ type: 'queryRemoved', query });
            }
        }
        clear() {
            notifyManager.batch(() => {
                this.queries.forEach(query => {
                    this.remove(query);
                });
            });
        }
        get(queryHash) {
            return this.queriesMap[queryHash];
        }
        getAll() {
            return this.queries;
        }
        find(arg1, arg2) {
            const [filters] = parseFilterArgs(arg1, arg2);
            if (typeof filters.exact === 'undefined') {
                filters.exact = true;
            }
            return this.queries.find(query => matchQuery(filters, query));
        }
        findAll(arg1, arg2) {
            const [filters] = parseFilterArgs(arg1, arg2);
            return Object.keys(filters).length > 0
                ? this.queries.filter(query => matchQuery(filters, query))
                : this.queries;
        }
        notify(event) {
            notifyManager.batch(() => {
                this.listeners.forEach(listener => {
                    listener(event);
                });
            });
        }
        onFocus() {
            notifyManager.batch(() => {
                this.queries.forEach(query => {
                    query.onFocus();
                });
            });
        }
        onOnline() {
            notifyManager.batch(() => {
                this.queries.forEach(query => {
                    query.onOnline();
                });
            });
        }
    }

    // CLASS
    class Mutation {
        constructor(config) {
            this.options = Object.assign(Object.assign({}, config.defaultOptions), config.options);
            this.mutationId = config.mutationId;
            this.mutationCache = config.mutationCache;
            this.observers = [];
            this.state = config.state || getDefaultState();
            this.meta = config.meta;
        }
        setState(state) {
            this.dispatch({ type: 'setState', state });
        }
        addObserver(observer) {
            if (this.observers.indexOf(observer) === -1) {
                this.observers.push(observer);
            }
        }
        removeObserver(observer) {
            this.observers = this.observers.filter(x => x !== observer);
        }
        cancel() {
            if (this.retryer) {
                this.retryer.cancel();
                return this.retryer.promise.then(noop).catch(noop);
            }
            return Promise.resolve();
        }
        continue() {
            if (this.retryer) {
                this.retryer.continue();
                return this.retryer.promise;
            }
            return this.execute();
        }
        execute() {
            let data;
            const restored = this.state.status === 'loading';
            let promise = Promise.resolve();
            if (!restored) {
                this.dispatch({ type: 'loading', variables: this.options.variables });
                promise = promise
                    .then(() => {
                    var _a, _b;
                    // Notify cache callback
                    (_b = (_a = this.mutationCache.config).onMutate) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.variables, this);
                })
                    .then(() => { var _a, _b; return (_b = (_a = this.options).onMutate) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.variables); })
                    .then(context => {
                    if (context !== this.state.context) {
                        this.dispatch({
                            type: 'loading',
                            context,
                            variables: this.state.variables,
                        });
                    }
                });
            }
            return promise
                .then(() => this.executeMutation())
                .then(result => {
                var _a, _b;
                data = result;
                // Notify cache callback
                (_b = (_a = this.mutationCache.config).onSuccess) === null || _b === void 0 ? void 0 : _b.call(_a, data, this.state.variables, this.state.context, this);
            })
                .then(() => { var _a, _b; return (_b = (_a = this.options).onSuccess) === null || _b === void 0 ? void 0 : _b.call(_a, data, this.state.variables, this.state.context); })
                .then(() => { var _a, _b; return (_b = (_a = this.options).onSettled) === null || _b === void 0 ? void 0 : _b.call(_a, data, null, this.state.variables, this.state.context); })
                .then(() => {
                this.dispatch({ type: 'success', data });
                return data;
            })
                .catch(error => {
                var _a, _b;
                // Notify cache callback
                (_b = (_a = this.mutationCache.config).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, this.state.variables, this.state.context, this);
                // Log error
                getLogger().error(error);
                return Promise.resolve()
                    .then(() => { var _a, _b; return (_b = (_a = this.options).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, this.state.variables, this.state.context); })
                    .then(() => { var _a, _b; return (_b = (_a = this.options).onSettled) === null || _b === void 0 ? void 0 : _b.call(_a, undefined, error, this.state.variables, this.state.context); })
                    .then(() => {
                    this.dispatch({ type: 'error', error });
                    throw error;
                });
            });
        }
        executeMutation() {
            var _a;
            this.retryer = new Retryer({
                fn: () => {
                    if (!this.options.mutationFn) {
                        return Promise.reject('No mutationFn found');
                    }
                    return this.options.mutationFn(this.state.variables);
                },
                onFail: () => {
                    this.dispatch({ type: 'failed' });
                },
                onPause: () => {
                    this.dispatch({ type: 'pause' });
                },
                onContinue: () => {
                    this.dispatch({ type: 'continue' });
                },
                retry: (_a = this.options.retry) !== null && _a !== void 0 ? _a : 0,
                retryDelay: this.options.retryDelay,
            });
            return this.retryer.promise;
        }
        dispatch(action) {
            this.state = reducer(this.state, action);
            notifyManager.batch(() => {
                this.observers.forEach(observer => {
                    observer.onMutationUpdate(action);
                });
                this.mutationCache.notify(this);
            });
        }
    }
    function getDefaultState() {
        return {
            context: undefined,
            data: undefined,
            error: null,
            failureCount: 0,
            isPaused: false,
            status: 'idle',
            variables: undefined,
        };
    }
    function reducer(state, action) {
        switch (action.type) {
            case 'failed':
                return Object.assign(Object.assign({}, state), { failureCount: state.failureCount + 1 });
            case 'pause':
                return Object.assign(Object.assign({}, state), { isPaused: true });
            case 'continue':
                return Object.assign(Object.assign({}, state), { isPaused: false });
            case 'loading':
                return Object.assign(Object.assign({}, state), { context: action.context, data: undefined, error: null, isPaused: false, status: 'loading', variables: action.variables });
            case 'success':
                return Object.assign(Object.assign({}, state), { data: action.data, error: null, status: 'success', isPaused: false });
            case 'error':
                return Object.assign(Object.assign({}, state), { data: undefined, error: action.error, failureCount: state.failureCount + 1, isPaused: false, status: 'error' });
            case 'setState':
                return Object.assign(Object.assign({}, state), action.state);
            default:
                return state;
        }
    }

    // CLASS
    class MutationCache extends Subscribable {
        constructor(config) {
            super();
            this.config = config || {};
            this.mutations = [];
            this.mutationId = 0;
        }
        build(client, options, state) {
            const mutation = new Mutation({
                mutationCache: this,
                mutationId: ++this.mutationId,
                options: client.defaultMutationOptions(options),
                state,
                defaultOptions: options.mutationKey
                    ? client.getMutationDefaults(options.mutationKey)
                    : undefined,
                meta: options.meta,
            });
            this.add(mutation);
            return mutation;
        }
        add(mutation) {
            this.mutations.push(mutation);
            this.notify(mutation);
        }
        remove(mutation) {
            this.mutations = this.mutations.filter(x => x !== mutation);
            mutation.cancel();
            this.notify(mutation);
        }
        clear() {
            notifyManager.batch(() => {
                this.mutations.forEach(mutation => {
                    this.remove(mutation);
                });
            });
        }
        getAll() {
            return this.mutations;
        }
        find(filters) {
            if (typeof filters.exact === 'undefined') {
                filters.exact = true;
            }
            return this.mutations.find(mutation => matchMutation(filters, mutation));
        }
        findAll(filters) {
            return this.mutations.filter(mutation => matchMutation(filters, mutation));
        }
        notify(mutation) {
            notifyManager.batch(() => {
                this.listeners.forEach(listener => {
                    listener(mutation);
                });
            });
        }
        onFocus() {
            this.resumePausedMutations();
        }
        onOnline() {
            this.resumePausedMutations();
        }
        resumePausedMutations() {
            const pausedMutations = this.mutations.filter(x => x.state.isPaused);
            return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop)), Promise.resolve()));
        }
    }

    function infiniteQueryBehavior() {
        return {
            onFetch: context => {
                context.fetchFn = () => {
                    var _a, _b, _c, _d, _e, _f;
                    const refetchPage = (_b = (_a = context.fetchOptions) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.refetchPage;
                    const fetchMore = (_d = (_c = context.fetchOptions) === null || _c === void 0 ? void 0 : _c.meta) === null || _d === void 0 ? void 0 : _d.fetchMore;
                    const pageParam = fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.pageParam;
                    const isFetchingNextPage = (fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.direction) === 'forward';
                    const isFetchingPreviousPage = (fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.direction) === 'backward';
                    const oldPages = ((_e = context.state.data) === null || _e === void 0 ? void 0 : _e.pages) || [];
                    const oldPageParams = ((_f = context.state.data) === null || _f === void 0 ? void 0 : _f.pageParams) || [];
                    const abortController = getAbortController();
                    const abortSignal = abortController === null || abortController === void 0 ? void 0 : abortController.signal;
                    let newPageParams = oldPageParams;
                    let cancelled = false;
                    // Get query function
                    const queryFn = context.options.queryFn || (() => Promise.reject('Missing queryFn'));
                    const buildNewPages = (pages, param, page, previous) => {
                        newPageParams = previous
                            ? [param, ...newPageParams]
                            : [...newPageParams, param];
                        return previous ? [page, ...pages] : [...pages, page];
                    };
                    // Create function to fetch a page
                    const fetchPage = (pages, manual, param, previous) => {
                        if (cancelled) {
                            return Promise.reject('Cancelled');
                        }
                        if (typeof param === 'undefined' && !manual && pages.length) {
                            return Promise.resolve(pages);
                        }
                        const queryFnContext = {
                            queryKey: context.queryKey,
                            signal: abortSignal,
                            pageParam: param,
                            meta: context.meta,
                        };
                        const queryFnResult = queryFn(queryFnContext);
                        const promise = Promise.resolve(queryFnResult).then(page => buildNewPages(pages, param, page, previous));
                        if (isCancelable(queryFnResult)) {
                            const promiseAsAny = promise;
                            promiseAsAny.cancel = queryFnResult.cancel;
                        }
                        return promise;
                    };
                    let promise;
                    // Fetch first page?
                    if (!oldPages.length) {
                        promise = fetchPage([]);
                    }
                    // Fetch next page?
                    else if (isFetchingNextPage) {
                        const manual = typeof pageParam !== 'undefined';
                        const param = manual
                            ? pageParam
                            : getNextPageParam(context.options, oldPages);
                        promise = fetchPage(oldPages, manual, param);
                    }
                    // Fetch previous page?
                    else if (isFetchingPreviousPage) {
                        const manual = typeof pageParam !== 'undefined';
                        const param = manual
                            ? pageParam
                            : getPreviousPageParam(context.options, oldPages);
                        promise = fetchPage(oldPages, manual, param, true);
                    }
                    // Refetch pages
                    else {
                        newPageParams = [];
                        const manual = typeof context.options.getNextPageParam === 'undefined';
                        const shouldFetchFirstPage = refetchPage && oldPages[0]
                            ? refetchPage(oldPages[0], 0, oldPages)
                            : true;
                        // Fetch first page
                        promise = shouldFetchFirstPage
                            ? fetchPage([], manual, oldPageParams[0])
                            : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0]));
                        // Fetch remaining pages
                        for (let i = 1; i < oldPages.length; i++) {
                            promise = promise.then(pages => {
                                const shouldFetchNextPage = refetchPage && oldPages[i]
                                    ? refetchPage(oldPages[i], i, oldPages)
                                    : true;
                                if (shouldFetchNextPage) {
                                    const param = manual
                                        ? oldPageParams[i]
                                        : getNextPageParam(context.options, pages);
                                    return fetchPage(pages, manual, param);
                                }
                                return Promise.resolve(buildNewPages(pages, oldPageParams[i], oldPages[i]));
                            });
                        }
                    }
                    const finalPromise = promise.then(pages => ({
                        pages,
                        pageParams: newPageParams,
                    }));
                    const finalPromiseAsAny = finalPromise;
                    finalPromiseAsAny.cancel = () => {
                        cancelled = true;
                        abortController === null || abortController === void 0 ? void 0 : abortController.abort();
                        if (isCancelable(promise)) {
                            promise.cancel();
                        }
                    };
                    return finalPromise;
                };
            },
        };
    }
    function getNextPageParam(options, pages) {
        var _a;
        return (_a = options.getNextPageParam) === null || _a === void 0 ? void 0 : _a.call(options, pages[pages.length - 1], pages);
    }
    function getPreviousPageParam(options, pages) {
        var _a;
        return (_a = options.getPreviousPageParam) === null || _a === void 0 ? void 0 : _a.call(options, pages[0], pages);
    }

    // CLASS
    class QueryClient {
        constructor(config = {}) {
            this.queryCache = config.queryCache || new QueryCache();
            this.mutationCache = config.mutationCache || new MutationCache();
            this.defaultOptions = config.defaultOptions || {};
            this.queryDefaults = [];
            this.mutationDefaults = [];
        }
        mount() {
            this.unsubscribeFocus = focusManager.subscribe(() => {
                if (focusManager.isFocused() && onlineManager.isOnline()) {
                    this.mutationCache.onFocus();
                    this.queryCache.onFocus();
                }
            });
            this.unsubscribeOnline = onlineManager.subscribe(() => {
                if (focusManager.isFocused() && onlineManager.isOnline()) {
                    this.mutationCache.onOnline();
                    this.queryCache.onOnline();
                }
            });
        }
        unmount() {
            var _a, _b;
            (_a = this.unsubscribeFocus) === null || _a === void 0 ? void 0 : _a.call(this);
            (_b = this.unsubscribeOnline) === null || _b === void 0 ? void 0 : _b.call(this);
        }
        isFetching(arg1, arg2) {
            const [filters] = parseFilterArgs(arg1, arg2);
            filters.fetching = true;
            return this.queryCache.findAll(filters).length;
        }
        isMutating(filters) {
            return this.mutationCache.findAll(Object.assign(Object.assign({}, filters), { fetching: true })).length;
        }
        getQueryData(queryKey, filters) {
            var _a;
            return (_a = this.queryCache.find(queryKey, filters)) === null || _a === void 0 ? void 0 : _a.state.data;
        }
        getQueriesData(queryKeyOrFilters) {
            return this.getQueryCache()
                .findAll(queryKeyOrFilters)
                .map(({ queryKey, state }) => {
                const data = state.data;
                return [queryKey, data];
            });
        }
        setQueryData(queryKey, updater, options) {
            const parsedOptions = parseQueryArgs(queryKey);
            const defaultedOptions = this.defaultQueryOptions(parsedOptions);
            return this.queryCache
                .build(this, defaultedOptions)
                .setData(updater, options);
        }
        setQueriesData(queryKeyOrFilters, updater, options) {
            return notifyManager.batch(() => this.getQueryCache()
                .findAll(queryKeyOrFilters)
                .map(({ queryKey }) => [
                queryKey,
                this.setQueryData(queryKey, updater, options),
            ]));
        }
        getQueryState(queryKey, filters) {
            var _a;
            return (_a = this.queryCache.find(queryKey, filters)) === null || _a === void 0 ? void 0 : _a.state;
        }
        removeQueries(arg1, arg2) {
            const [filters] = parseFilterArgs(arg1, arg2);
            const queryCache = this.queryCache;
            notifyManager.batch(() => {
                queryCache.findAll(filters).forEach(query => {
                    queryCache.remove(query);
                });
            });
        }
        resetQueries(arg1, arg2, arg3) {
            const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
            const queryCache = this.queryCache;
            const refetchFilters = Object.assign(Object.assign({}, filters), { active: true });
            return notifyManager.batch(() => {
                queryCache.findAll(filters).forEach(query => {
                    query.reset();
                });
                return this.refetchQueries(refetchFilters, options);
            });
        }
        cancelQueries(arg1, arg2, arg3) {
            const [filters, cancelOptions = {}] = parseFilterArgs(arg1, arg2, arg3);
            if (typeof cancelOptions.revert === 'undefined') {
                cancelOptions.revert = true;
            }
            const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map(query => query.cancel(cancelOptions)));
            return Promise.all(promises).then(noop).catch(noop);
        }
        invalidateQueries(arg1, arg2, arg3) {
            var _a, _b, _c;
            const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
            const refetchFilters = Object.assign(Object.assign({}, filters), { 
                // if filters.refetchActive is not provided and filters.active is explicitly false,
                // e.g. invalidateQueries({ active: false }), we don't want to refetch active queries
                active: (_b = (_a = filters.refetchActive) !== null && _a !== void 0 ? _a : filters.active) !== null && _b !== void 0 ? _b : true, inactive: (_c = filters.refetchInactive) !== null && _c !== void 0 ? _c : false });
            return notifyManager.batch(() => {
                this.queryCache.findAll(filters).forEach(query => {
                    query.invalidate();
                });
                return this.refetchQueries(refetchFilters, options);
            });
        }
        refetchQueries(arg1, arg2, arg3) {
            const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
            const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map(query => query.fetch(undefined, Object.assign(Object.assign({}, options), { meta: { refetchPage: filters === null || filters === void 0 ? void 0 : filters.refetchPage } }))));
            let promise = Promise.all(promises).then(noop);
            if (!(options === null || options === void 0 ? void 0 : options.throwOnError)) {
                promise = promise.catch(noop);
            }
            return promise;
        }
        fetchQuery(arg1, arg2, arg3) {
            const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
            const defaultedOptions = this.defaultQueryOptions(parsedOptions);
            // https://github.com/tannerlinsley/react-query/issues/652
            if (typeof defaultedOptions.retry === 'undefined') {
                defaultedOptions.retry = false;
            }
            const query = this.queryCache.build(this, defaultedOptions);
            return query.isStaleByTime(defaultedOptions.staleTime)
                ? query.fetch(defaultedOptions)
                : Promise.resolve(query.state.data);
        }
        prefetchQuery(arg1, arg2, arg3) {
            return this.fetchQuery(arg1, arg2, arg3)
                .then(noop)
                .catch(noop);
        }
        fetchInfiniteQuery(arg1, arg2, arg3) {
            const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
            parsedOptions.behavior = infiniteQueryBehavior();
            return this.fetchQuery(parsedOptions);
        }
        prefetchInfiniteQuery(arg1, arg2, arg3) {
            return this.fetchInfiniteQuery(arg1, arg2, arg3)
                .then(noop)
                .catch(noop);
        }
        cancelMutations() {
            const promises = notifyManager.batch(() => this.mutationCache.getAll().map(mutation => mutation.cancel()));
            return Promise.all(promises).then(noop).catch(noop);
        }
        resumePausedMutations() {
            return this.getMutationCache().resumePausedMutations();
        }
        executeMutation(options) {
            return this.mutationCache.build(this, options).execute();
        }
        getQueryCache() {
            return this.queryCache;
        }
        getMutationCache() {
            return this.mutationCache;
        }
        getDefaultOptions() {
            return this.defaultOptions;
        }
        setDefaultOptions(options) {
            this.defaultOptions = options;
        }
        setQueryDefaults(queryKey, options) {
            const result = this.queryDefaults.find(x => hashQueryKey(queryKey) === hashQueryKey(x.queryKey));
            if (result) {
                result.defaultOptions = options;
            }
            else {
                this.queryDefaults.push({ queryKey, defaultOptions: options });
            }
        }
        getQueryDefaults(queryKey) {
            var _a;
            return queryKey
                ? (_a = this.queryDefaults.find(x => partialMatchKey(queryKey, x.queryKey))) === null || _a === void 0 ? void 0 : _a.defaultOptions : undefined;
        }
        setMutationDefaults(mutationKey, options) {
            const result = this.mutationDefaults.find(x => hashQueryKey(mutationKey) === hashQueryKey(x.mutationKey));
            if (result) {
                result.defaultOptions = options;
            }
            else {
                this.mutationDefaults.push({ mutationKey, defaultOptions: options });
            }
        }
        getMutationDefaults(mutationKey) {
            var _a;
            return mutationKey
                ? (_a = this.mutationDefaults.find(x => partialMatchKey(mutationKey, x.mutationKey))) === null || _a === void 0 ? void 0 : _a.defaultOptions : undefined;
        }
        defaultQueryOptions(options) {
            if (options === null || options === void 0 ? void 0 : options._defaulted) {
                return options;
            }
            const defaultedOptions = Object.assign(Object.assign(Object.assign(Object.assign({}, this.defaultOptions.queries), this.getQueryDefaults(options === null || options === void 0 ? void 0 : options.queryKey)), options), { _defaulted: true });
            if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
                defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
            }
            return defaultedOptions;
        }
        defaultQueryObserverOptions(options) {
            return this.defaultQueryOptions(options);
        }
        defaultMutationOptions(options) {
            if (options === null || options === void 0 ? void 0 : options._defaulted) {
                return options;
            }
            return Object.assign(Object.assign(Object.assign(Object.assign({}, this.defaultOptions.mutations), this.getMutationDefaults(options === null || options === void 0 ? void 0 : options.mutationKey)), options), { _defaulted: true });
        }
        clear() {
            this.queryCache.clear();
            this.mutationCache.clear();
        }
    }

    /* node_modules\@sveltestack\svelte-query\svelte\queryClientProvider\QueryClientProvider.svelte generated by Svelte v3.42.1 */

    function create_fragment$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QueryClientProvider', slots, ['default']);
    	
    	let { queryCache = new QueryCache() } = $$props;
    	let { mutationCache = new MutationCache() } = $$props;
    	let { defaultOptions = {} } = $$props;

    	let { client = new QueryClient({
    			queryCache,
    			mutationCache,
    			defaultOptions
    		}) } = $$props;

    	onMount(() => {
    		client.mount();
    	});

    	setContext('queryClient', client);

    	onDestroy(() => {
    		client.unmount();
    	});

    	const writable_props = ['queryCache', 'mutationCache', 'defaultOptions', 'client'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QueryClientProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('queryCache' in $$props) $$invalidate(0, queryCache = $$props.queryCache);
    		if ('mutationCache' in $$props) $$invalidate(1, mutationCache = $$props.mutationCache);
    		if ('defaultOptions' in $$props) $$invalidate(2, defaultOptions = $$props.defaultOptions);
    		if ('client' in $$props) $$invalidate(3, client = $$props.client);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		onDestroy,
    		MutationCache,
    		QueryCache,
    		QueryClient,
    		queryCache,
    		mutationCache,
    		defaultOptions,
    		client
    	});

    	$$self.$inject_state = $$props => {
    		if ('queryCache' in $$props) $$invalidate(0, queryCache = $$props.queryCache);
    		if ('mutationCache' in $$props) $$invalidate(1, mutationCache = $$props.mutationCache);
    		if ('defaultOptions' in $$props) $$invalidate(2, defaultOptions = $$props.defaultOptions);
    		if ('client' in $$props) $$invalidate(3, client = $$props.client);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [queryCache, mutationCache, defaultOptions, client, $$scope, slots];
    }

    class QueryClientProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			queryCache: 0,
    			mutationCache: 1,
    			defaultOptions: 2,
    			client: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QueryClientProvider",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get queryCache() {
    		throw new Error("<QueryClientProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set queryCache(value) {
    		throw new Error("<QueryClientProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mutationCache() {
    		throw new Error("<QueryClientProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mutationCache(value) {
    		throw new Error("<QueryClientProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultOptions() {
    		throw new Error("<QueryClientProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultOptions(value) {
    		throw new Error("<QueryClientProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client() {
    		throw new Error("<QueryClientProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client(value) {
    		throw new Error("<QueryClientProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var QueryClientProvider$1 = QueryClientProvider;

    function useQueryClient() {
        const queryClient = getContext('queryClient');
        if (!queryClient) {
            throw new Error('No QueryClient set, use QueryClientProvider to set one');
        }
        return queryClient;
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function setBatchCalls(options) {
        // Make sure results are optimistically set in fetching state before subscribing or updating options
        options.optimisticResults = true;
        if (options.onError) {
            options.onError = notifyManager.batchCalls(options.onError);
        }
        if (options.onSuccess) {
            options.onSuccess = notifyManager.batchCalls(options.onSuccess);
        }
        if (options.onSettled) {
            options.onSettled = notifyManager.batchCalls(options.onSettled);
        }
        return options;
    }

    /* eslint-disable no-shadow */
    function useQuery(arg1, arg2, arg3) {
        const options = parseQueryArgs(arg1, arg2, arg3);
        const client = useQueryClient();
        let defaultedOptions = client.defaultQueryObserverOptions(options);
        // Include callbacks in batch renders
        defaultedOptions = setBatchCalls(defaultedOptions);
        const observer = new QueryObserver(client, defaultedOptions);
        const { subscribe } = readable(observer.getCurrentResult(), set => {
            return observer.subscribe(notifyManager.batchCalls(set));
        });
        // Update result to make sure we did not miss any query updates
        // between creating the observer and subscribing to it.
        observer.updateResult();
        function setOptions(arg1, arg2, arg3) {
            const options = parseQueryArgs(arg1, arg2, arg3);
            let defaultedOptions = client.defaultQueryObserverOptions(options);
            // Include callbacks in batch renders
            defaultedOptions = setBatchCalls(defaultedOptions);
            if (observer.hasListeners()) {
                observer.setOptions(defaultedOptions, { listeners: false });
            }
        }
        function updateOptions(options) {
            observer.updateOptions(options);
        }
        function setEnabled(enabled) {
            updateOptions({ enabled });
        }
        return { subscribe, setOptions, updateOptions, setEnabled };
    }

    const { set, subscribe } = writable({});

    const remove = () => {
      set({});
    };

    const activeRoute = {
      subscribe,
      set,
      remove,
    };

    const UrlParser = (urlString, namedUrl = '') => {
      const urlBase = new URL(urlString);

      /**
       * Wrapper for URL.hash
       *
       **/
      function hash() {
        return urlBase.hash;
      }

      /**
       * Wrapper for URL.host
       *
       **/
      function host() {
        return urlBase.host;
      }

      /**
       * Wrapper for URL.hostname
       *
       **/
      function hostname() {
        return urlBase.hostname;
      }

      /**
       * Returns an object with all the named params and their values
       *
       **/
      function namedParams() {
        const allPathName = pathNames();
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values[paramKey.value] = allPathName[paramKey.index];
          return values;
        }, {});
      }

      /**
       * Returns an array with all the named param keys
       *
       **/
      function namedParamsKeys() {
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values.push(paramKey.value);
          return values;
        }, []);
      }

      /**
       * Returns an array with all the named param values
       *
       **/
      function namedParamsValues() {
        const allPathName = pathNames();
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values.push(allPathName[paramKey.index]);
          return values;
        }, []);
      }

      /**
       * Returns an array with all named param ids and their position in the path
       * Private
       **/
      function namedParamsWithIndex() {
        const namedUrlParams = getPathNames(namedUrl);

        return namedUrlParams.reduce((validParams, param, index) => {
          if (param[0] === ':') {
            validParams.push({ value: param.slice(1), index });
          }
          return validParams;
        }, []);
      }

      /**
       * Wrapper for URL.port
       *
       **/
      function port() {
        return urlBase.port;
      }

      /**
       * Wrapper for URL.pathname
       *
       **/
      function pathname() {
        return urlBase.pathname;
      }

      /**
       * Wrapper for URL.protocol
       *
       **/
      function protocol() {
        return urlBase.protocol;
      }

      /**
       * Wrapper for URL.search
       *
       **/
      function search() {
        return urlBase.search;
      }

      /**
       * Returns an object with all query params and their values
       *
       **/
      function queryParams() {
        const params = {};
        urlBase.searchParams.forEach((value, key) => {
          params[key] = value;
        });

        return params;
      }

      /**
       * Returns an array with all the query param keys
       *
       **/
      function queryParamsKeys() {
        const params = [];
        urlBase.searchParams.forEach((_value, key) => {
          params.push(key);
        });

        return params;
      }

      /**
       * Returns an array with all the query param values
       *
       **/
      function queryParamsValues() {
        const params = [];
        urlBase.searchParams.forEach((value) => {
          params.push(value);
        });

        return params;
      }

      /**
       * Returns an array with all the elements of a pathname
       *
       **/
      function pathNames() {
        return getPathNames(urlBase.pathname);
      }

      /**
       * Returns an array with all the parts of a pathname
       * Private method
       **/
      function getPathNames(pathName) {
        if (pathName === '/' || pathName.trim().length === 0) return [pathName];
        if (pathName.slice(-1) === '/') {
          pathName = pathName.slice(0, -1);
        }
        if (pathName[0] === '/') {
          pathName = pathName.slice(1);
        }

        return pathName.split('/');
      }

      return Object.freeze({
        hash: hash(),
        host: host(),
        hostname: hostname(),
        namedParams: namedParams(),
        namedParamsKeys: namedParamsKeys(),
        namedParamsValues: namedParamsValues(),
        pathNames: pathNames(),
        port: port(),
        pathname: pathname(),
        protocol: protocol(),
        search: search(),
        queryParams: queryParams(),
        queryParamsKeys: queryParamsKeys(),
        queryParamsValues: queryParamsValues(),
      });
    };

    /**
     * Returns true if object has any nested routes empty
     * @param routeObject
     **/
    const anyEmptyNestedRoutes = (routeObject) => {
      let result = false;
      if (Object.keys(routeObject).length === 0) {
        return true;
      }

      if (routeObject.childRoute && Object.keys(routeObject.childRoute).length === 0) {
        result = true;
      } else if (routeObject.childRoute) {
        result = anyEmptyNestedRoutes(routeObject.childRoute);
      }

      return result;
    };

    /**
     * Compare two routes ignoring named params
     * @param pathName string
     * @param routeName string
     **/

    const compareRoutes = (pathName, routeName) => {
      routeName = removeSlash(routeName);

      if (routeName.includes(':')) {
        return routeName.includes(pathName);
      } else {
        return routeName.startsWith(pathName);
      }
    };

    /**
     * Returns a boolean indicating if the name of path exists in the route based on the language parameter
     * @param pathName string
     * @param route object
     * @param language string
     **/

    const findLocalisedRoute = (pathName, route, language) => {
      let exists = false;

      if (language) {
        return { exists: route.lang && route.lang[language] && route.lang[language].includes(pathName), language };
      }

      exists = compareRoutes(pathName, route.name);

      if (!exists && route.lang && typeof route.lang === 'object') {
        for (const [key, value] of Object.entries(route.lang)) {
          if (compareRoutes(pathName, value)) {
            exists = true;
            language = key;
          }
        }
      }

      return { exists, language };
    };

    /**
     * Return all the consecutive named param (placeholders) of a pathname
     * @param pathname
     **/
    const getNamedParams = (pathName = '') => {
      if (pathName.trim().length === 0) return [];
      const namedUrlParams = getPathNames(pathName);
      return namedUrlParams.reduce((validParams, param) => {
        if (param[0] === ':') {
          validParams.push(param.slice(1));
        }

        return validParams;
      }, []);
    };

    /**
     * Split a pathname based on /
     * @param pathName
     * Private method
     **/
    const getPathNames = (pathName) => {
      if (pathName === '/' || pathName.trim().length === 0) return [pathName];

      pathName = removeSlash(pathName, 'both');

      return pathName.split('/');
    };

    /**
     * Return the first part of a pathname until the first named param is found
     * @param name
     **/
    const nameToPath = (name = '') => {
      let routeName;
      if (name === '/' || name.trim().length === 0) return name;
      name = removeSlash(name, 'lead');
      routeName = name.split(':')[0];
      routeName = removeSlash(routeName, 'trail');

      return routeName.toLowerCase();
    };

    /**
     * Return the path name excluding query params
     * @param name
     **/
    const pathWithoutQueryParams = (currentRoute) => {
      const path = currentRoute.path.split('?');
      return path[0];
    };

    /**
     * Return the path name including query params
     * @param name
     **/
    const pathWithQueryParams = (currentRoute) => {
      let queryParams = [];
      if (currentRoute.queryParams) {
        for (let [key, value] of Object.entries(currentRoute.queryParams)) {
          queryParams.push(`${key}=${value}`);
        }
      }

      const hash = currentRoute.hash ? currentRoute.hash : '';

      if (queryParams.length > 0) {
        return `${currentRoute.path}?${queryParams.join('&')}${hash}`;
      } else {
        return currentRoute.path + hash;
      }
    };

    /**
     * Returns a string with trailing or leading slash character removed
     * @param pathName string
     * @param position string - lead, trail, both
     **/
    const removeExtraPaths = (pathNames, basePathNames) => {
      const names = basePathNames.split('/');
      if (names.length > 1) {
        names.forEach(function (name, index) {
          if (name.length > 0 && index > 0) {
            pathNames.shift();
          }
        });
      }

      return pathNames;
    };

    /**
     * Returns a string with trailing or leading slash character removed
     * @param pathName string
     * @param position string - lead, trail, both
     **/

    const removeSlash = (pathName, position = 'lead') => {
      if (position === 'trail' || position === 'both') {
        pathName = pathName.replace(/\/$/, '');
      }

      if (position === 'lead' || position === 'both') {
        pathName = pathName.replace(/^\//, '');
      }

      return pathName;
    };

    /**
     * Returns the name of the route based on the language parameter
     * @param route object
     * @param language string
     **/

    const routeNameLocalised = (route, language = null) => {
      if (!language || !route.lang || !route.lang[language]) {
        return route.name;
      } else {
        return route.lang[language];
      }
    };

    /**
     * Return the path name excluding query params
     * @param name
     **/
    const startsWithNamedParam = (currentRoute) => {
      const routeName = removeSlash(currentRoute);

      return routeName.startsWith(':');
    };

    /**
     * Updates the base route path.
     * Route objects can have nested routes (childRoutes) or just a long name like "admin/employees/show/:id"
     *
     * @param basePath string
     * @param pathNames array
     * @param route object
     * @param language string
     **/

    const updateRoutePath = (basePath, pathNames, route, language, convert = false) => {
      if (basePath === '/' || basePath.trim().length === 0) return { result: basePath, language: null };

      let basePathResult = basePath;
      let routeName = route.name;
      let currentLanguage = language;

      if (convert) {
        currentLanguage = '';
      }

      routeName = removeSlash(routeName);
      basePathResult = removeSlash(basePathResult);

      if (!route.childRoute) {
        let localisedRoute = findLocalisedRoute(basePathResult, route, currentLanguage);

        if (localisedRoute.exists && convert) {
          basePathResult = routeNameLocalised(route, language);
        }

        let routeNames = routeName.split(':')[0];
        routeNames = removeSlash(routeNames, 'trail');
        routeNames = routeNames.split('/');
        routeNames.shift();
        routeNames.forEach(() => {
          const currentPathName = pathNames[0];
          localisedRoute = findLocalisedRoute(`${basePathResult}/${currentPathName}`, route, currentLanguage);

          if (currentPathName && localisedRoute.exists) {
            if (convert) {
              basePathResult = routeNameLocalised(route, language);
            } else {
              basePathResult = `${basePathResult}/${currentPathName}`;
            }
            pathNames.shift();
          } else {
            return { result: basePathResult, language: localisedRoute.language };
          }
        });
        return { result: basePathResult, language: localisedRoute.language };
      } else {
        return { result: basePath, language: currentLanguage };
      }
    };

    const RouterCurrent = (trackPage) => {
      const trackPageview = trackPage || false;
      let activeRoute = '';

      const setActive = (newRoute, updateBrowserHistory) => {
        activeRoute = newRoute.path;
        pushActiveRoute(newRoute, updateBrowserHistory);
      };

      const active = () => {
        return activeRoute;
      };

      /**
       * Returns true if pathName is current active route
       * @param pathName String The path name to check against the current route.
       * @param includePath Boolean if true checks that pathName is included in current route. If false should match it.
       **/
      const isActive = (queryPath, includePath = false) => {
        if (queryPath[0] !== '/') {
          queryPath = '/' + queryPath;
        }

        // remove query params for comparison
        let pathName = UrlParser(`http://fake.com${queryPath}`).pathname;
        let activeRoutePath = UrlParser(`http://fake.com${activeRoute}`).pathname;

        pathName = removeSlash(pathName, 'trail');

        activeRoutePath = removeSlash(activeRoutePath, 'trail');

        if (includePath) {
          return activeRoutePath.includes(pathName);
        } else {
          return activeRoutePath === pathName;
        }
      };

      const pushActiveRoute = (newRoute, updateBrowserHistory) => {
        if (typeof window !== 'undefined') {
          const pathAndSearch = pathWithQueryParams(newRoute);

          if (updateBrowserHistory) {
            window.history.pushState({ page: pathAndSearch }, '', pathAndSearch);
          }
          // Moving back in history does not update browser history but does update tracking.
          if (trackPageview) {
            gaTracking(pathAndSearch);
          }
        }
      };

      const gaTracking = (newPage) => {
        if (typeof ga !== 'undefined') {
          ga('set', 'page', newPage);
          ga('send', 'pageview');
        }
      };

      return Object.freeze({ active, isActive, setActive });
    };

    const RouterGuard = (onlyIf) => {
      const guardInfo = onlyIf;

      const valid = () => {
        return guardInfo && guardInfo.guard && typeof guardInfo.guard === 'function';
      };

      const redirect = () => {
        return !guardInfo.guard();
      };

      const redirectPath = () => {
        let destinationUrl = '/';
        if (guardInfo.redirect && guardInfo.redirect.length > 0) {
          destinationUrl = guardInfo.redirect;
        }

        return destinationUrl;
      };

      return Object.freeze({ valid, redirect, redirectPath });
    };

    const RouterRedirect = (route, currentPath) => {
      const guard = RouterGuard(route.onlyIf);

      const path = () => {
        let redirectTo = currentPath;
        if (route.redirectTo && route.redirectTo.length > 0) {
          redirectTo = route.redirectTo;
        }

        if (guard.valid() && guard.redirect()) {
          redirectTo = guard.redirectPath();
        }

        return redirectTo;
      };

      return Object.freeze({ path });
    };

    function RouterRoute({ routeInfo, path, routeNamedParams, urlParser, namedPath, language }) {
      const namedParams = () => {
        const parsedParams = UrlParser(`https://fake.com${urlParser.pathname}`, namedPath).namedParams;

        return { ...routeNamedParams, ...parsedParams };
      };

      const get = () => {
        return {
          name: path,
          component: routeInfo.component,
          hash: urlParser.hash,
          layout: routeInfo.layout,
          queryParams: urlParser.queryParams,
          namedParams: namedParams(),
          path,
          language,
        };
      };

      return Object.freeze({ get, namedParams });
    }

    function RouterPath({ basePath, basePathName, pathNames, convert, currentLanguage }) {
      let updatedPathRoute;
      let route;
      let routePathLanguage = currentLanguage;

      function updatedPath(currentRoute) {
        route = currentRoute;
        updatedPathRoute = updateRoutePath(basePathName, pathNames, route, routePathLanguage, convert);
        routePathLanguage = convert ? currentLanguage : updatedPathRoute.language;

        return updatedPathRoute;
      }

      function localisedPathName() {
        return routeNameLocalised(route, routePathLanguage);
      }

      function localisedRouteWithoutNamedParams() {
        return nameToPath(localisedPathName());
      }

      function basePathNameWithoutNamedParams() {
        return nameToPath(updatedPathRoute.result);
      }

      function namedPath() {
        let localisedPath = localisedPathName();
        if (localisedPath && !localisedPath.startsWith('/')) {
          localisedPath = '/' + localisedPath;
        }

        return basePath ? `${basePath}${localisedPath}` : localisedPath;
      }

      function routePath() {
        let routePathValue = `${basePath}/${basePathNameWithoutNamedParams()}`;
        if (routePathValue === '//') {
          routePathValue = '/';
        }

        if (routePathLanguage) {
          pathNames = removeExtraPaths(pathNames, localisedRouteWithoutNamedParams());
        }

        const namedParams = getNamedParams(localisedPathName());
        if (namedParams && namedParams.length > 0) {
          namedParams.forEach(function () {
            if (pathNames.length > 0) {
              routePathValue += `/${pathNames.shift()}`;
            }
          });
        }

        return routePathValue;
      }

      function routeLanguage() {
        return routePathLanguage;
      }

      function basePathSameAsLocalised() {
        return basePathNameWithoutNamedParams() === localisedRouteWithoutNamedParams();
      }

      return Object.freeze({
        basePathSameAsLocalised,
        updatedPath,
        basePathNameWithoutNamedParams,
        localisedPathName,
        localisedRouteWithoutNamedParams,
        namedPath,
        pathNames,
        routeLanguage,
        routePath,
      });
    }

    const NotFoundPage$1 = '/404.html';

    function RouterFinder({ routes, currentUrl, routerOptions, convert }) {
      const defaultLanguage = routerOptions.defaultLanguage;
      const sitePrefix = routerOptions.prefix ? routerOptions.prefix.toLowerCase() : '';
      const urlParser = parseCurrentUrl(currentUrl, sitePrefix);
      let redirectTo = '';
      let routeNamedParams = {};
      let staticParamMatch = false;

      function findActiveRoute() {
        let searchActiveRoute = searchActiveRoutes(routes, '', urlParser.pathNames, routerOptions.lang, convert);

        if (!searchActiveRoute || !Object.keys(searchActiveRoute).length || anyEmptyNestedRoutes(searchActiveRoute)) {
          if (typeof window !== 'undefined') {
            searchActiveRoute = routeNotFound(routerOptions.lang);
          }
        } else {
          searchActiveRoute.path = pathWithoutQueryParams(searchActiveRoute);
          if (sitePrefix) {
            searchActiveRoute.path = `/${sitePrefix}${searchActiveRoute.path}`;
          }
        }

        return searchActiveRoute;
      }

      /**
       * Gets an array of routes and the browser pathname and return the active route
       * @param routes
       * @param basePath
       * @param pathNames
       **/
      function searchActiveRoutes(routes, basePath, pathNames, currentLanguage, convert) {
        let currentRoute = {};
        let basePathName = pathNames.shift().toLowerCase();
        const routerPath = RouterPath({ basePath, basePathName, pathNames, convert, currentLanguage });
        staticParamMatch = false;

        routes.forEach(function (route) {
          routerPath.updatedPath(route);

          if (matchRoute(routerPath, route.name)) {
            let routePath = routerPath.routePath();
            redirectTo = RouterRedirect(route, redirectTo).path();

            if (currentRoute.name !== routePath) {
              currentRoute = setCurrentRoute({
                route,
                routePath,
                routeLanguage: routerPath.routeLanguage(),
                urlParser,
                namedPath: routerPath.namedPath(),
              });
            }

            if (route.nestedRoutes && route.nestedRoutes.length > 0 && routerPath.pathNames.length > 0) {
              currentRoute.childRoute = searchActiveRoutes(
                route.nestedRoutes,
                routePath,
                routerPath.pathNames,
                routerPath.routeLanguage(),
                convert
              );
              currentRoute.path = currentRoute.childRoute.path;
              currentRoute.language = currentRoute.childRoute.language;
            } else if (nestedRoutesAndNoPath(route, routerPath.pathNames)) {
              const indexRoute = searchActiveRoutes(
                route.nestedRoutes,
                routePath,
                ['index'],
                routerPath.routeLanguage(),
                convert
              );
              if (indexRoute && Object.keys(indexRoute).length > 0) {
                currentRoute.childRoute = indexRoute;
                currentRoute.language = currentRoute.childRoute.language;
              }
            }
          }
        });

        if (redirectTo) {
          currentRoute.redirectTo = redirectTo;
        }

        return currentRoute;
      }

      function matchRoute(routerPath, routeName) {
        const basePathSameAsLocalised = routerPath.basePathSameAsLocalised();
        if (basePathSameAsLocalised) {
          staticParamMatch = true;
        }

        return basePathSameAsLocalised || (!staticParamMatch && startsWithNamedParam(routeName));
      }

      function nestedRoutesAndNoPath(route, pathNames) {
        return route.nestedRoutes && route.nestedRoutes.length > 0 && pathNames.length === 0;
      }

      function parseCurrentUrl(currentUrl, sitePrefix) {
        if (sitePrefix && sitePrefix.trim().length > 0) {
          const replacePattern = currentUrl.endsWith(sitePrefix) ? sitePrefix : sitePrefix + "/";
          const noPrefixUrl = currentUrl.replace(replacePattern, '');
          return UrlParser(noPrefixUrl);
        } else {
          return UrlParser(currentUrl);
        }
      }

      function setCurrentRoute({ route, routePath, routeLanguage, urlParser, namedPath }) {
        const routerRoute = RouterRoute({
          routeInfo: route,
          urlParser,
          path: routePath,
          routeNamedParams,
          namedPath,
          language: routeLanguage || defaultLanguage,
        });
        routeNamedParams = routerRoute.namedParams();

        return routerRoute.get();
      }

      const routeNotFound = (customLanguage) => {
        const custom404Page = routes.find((route) => route.name == '404');
        const language = customLanguage || defaultLanguage || '';
        if (custom404Page) {
          return { ...custom404Page, language, path: '404' };
        } else {
          return { name: '404', component: '', path: '404', redirectTo: NotFoundPage$1 };
        }
      };

      return Object.freeze({ findActiveRoute });
    }

    const NotFoundPage = '/404.html';

    let userDefinedRoutes = [];
    let routerOptions = {};
    let routerCurrent;

    /**
     * Object exposes one single property: activeRoute
     * @param routes  Array of routes
     * @param currentUrl current url
     * @param options configuration options
     **/
    const SpaRouter = (routes, currentUrl, options = {}) => {
      routerOptions = { ...options };
      if (typeof currentUrl === 'undefined' || currentUrl === '') {
        currentUrl = document.location.href;
      }

      routerCurrent = RouterCurrent(routerOptions.gaPageviews);

      currentUrl = removeSlash(currentUrl, 'trail');
      userDefinedRoutes = routes;

      const findActiveRoute = () => {
        let convert = false;

        if (routerOptions.langConvertTo) {
          routerOptions.lang = routerOptions.langConvertTo;
          convert = true;
        }

        return RouterFinder({ routes, currentUrl, routerOptions, convert }).findActiveRoute();
      };

      /**
       * Redirect current route to another
       * @param destinationUrl
       **/
      const navigateNow = (destinationUrl, updateBrowserHistory) => {
        if (typeof window !== 'undefined') {
          if (destinationUrl === NotFoundPage) {
            routerCurrent.setActive({ path: NotFoundPage }, updateBrowserHistory);
          } else {
            navigateTo(destinationUrl);
          }
        }

        return destinationUrl;
      };

      const setActiveRoute = (updateBrowserHistory = true) => {
        const currentRoute = findActiveRoute();
        if (currentRoute.redirectTo) {
          return navigateNow(currentRoute.redirectTo, updateBrowserHistory);
        }

        routerCurrent.setActive(currentRoute, updateBrowserHistory);
        activeRoute.set(currentRoute);

        return currentRoute;
      };

      return Object.freeze({
        setActiveRoute,
        findActiveRoute,
      });
    };

    /**
     * Updates the current active route and updates the browser pathname
     * @param pathName String
     * @param language String
     * @param updateBrowserHistory Boolean
     **/
    const navigateTo = (pathName, language = null, updateBrowserHistory = true) => {
      pathName = removeSlash(pathName, 'lead');

      if (language) {
        routerOptions.langConvertTo = language;
      }

      return SpaRouter(userDefinedRoutes, 'http://fake.com/' + pathName, routerOptions).setActiveRoute(
        updateBrowserHistory
      );
    };

    if (typeof window !== 'undefined') {
      // Avoid full page reload on local routes
      window.addEventListener('click', (event) => {
        if (event.target.localName.toLowerCase() !== 'a') return;
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;

        const sitePrefix = routerOptions.prefix ? `/${routerOptions.prefix.toLowerCase()}` : '';
        const targetHostNameInternal = event.target.pathname && event.target.host === window.location.host;
        const prefixMatchPath = sitePrefix.length > 1 ? event.target.pathname.startsWith(sitePrefix) : true;

        if (targetHostNameInternal && prefixMatchPath) {
          event.preventDefault();
          let navigatePathname = event.target.pathname + event.target.search;

          const destinationUrl = navigatePathname + event.target.search + event.target.hash;
          if (event.target.target === '_blank') {
            window.open(destinationUrl, 'newTab');
          } else {
            navigateTo(destinationUrl);
          }
        }
      });

      window.onpopstate = function (_event) {
        let navigatePathname = window.location.pathname + window.location.search + window.location.hash;

        navigateTo(navigatePathname, null, false);
      };
    }

    /* node_modules\svelte-router-spa\src\components\route.svelte generated by Svelte v3.42.1 */

    // (10:34) 
    function create_if_block_2(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0].childRoute,
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0].childRoute;
    			if (dirty & /*params*/ 2) route_changes.params = /*params*/ ctx[1];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(10:34) ",
    		ctx
    	});

    	return block;
    }

    // (8:33) 
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentRoute*/ ctx[0].component;

    	function switch_props(ctx) {
    		return {
    			props: {
    				currentRoute: {
    					.../*currentRoute*/ ctx[0],
    					component: ''
    				},
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*currentRoute*/ 1) switch_instance_changes.currentRoute = {
    				.../*currentRoute*/ ctx[0],
    				component: ''
    			};

    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*currentRoute*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(8:33) ",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if currentRoute.layout}
    function create_if_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentRoute*/ ctx[0].layout;

    	function switch_props(ctx) {
    		return {
    			props: {
    				currentRoute: { .../*currentRoute*/ ctx[0], layout: '' },
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*currentRoute*/ 1) switch_instance_changes.currentRoute = { .../*currentRoute*/ ctx[0], layout: '' };
    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*currentRoute*/ ctx[0].layout)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(6:0) {#if currentRoute.layout}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentRoute*/ ctx[0].layout) return 0;
    		if (/*currentRoute*/ ctx[0].component) return 1;
    		if (/*currentRoute*/ ctx[0].childRoute) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, []);
    	let { currentRoute = {} } = $$props;
    	let { params = {} } = $$props;
    	const writable_props = ['currentRoute', 'params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({ currentRoute, params });

    	$$self.$inject_state = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentRoute, params];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { currentRoute: 0, params: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get currentRoute() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get params() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-router-spa\src\components\router.svelte generated by Svelte v3.42.1 */

    function create_fragment$9(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: { currentRoute: /*$activeRoute*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};
    			if (dirty & /*$activeRoute*/ 1) route_changes.currentRoute = /*$activeRoute*/ ctx[0];
    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, $$value => $$invalidate(0, $activeRoute = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = [] } = $$props;
    	let { options = {} } = $$props;

    	onMount(() => {
    		SpaRouter(routes, document.location.href, options).setActiveRoute();
    	});

    	const writable_props = ['routes', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(1, routes = $$props.routes);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		SpaRouter,
    		Route,
    		activeRoute,
    		routes,
    		options,
    		$activeRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(1, routes = $$props.routes);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$activeRoute, routes, options];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { routes: 1, options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get routes() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Page\Index.svelte generated by Svelte v3.42.1 */

    const file$7 = "src\\components\\Page\\Index.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Welcome, ");
    			t1 = text(/*user*/ ctx[0]);
    			attr_dev(h1, "class", "font-sans tracking-tight font-bold text-xl");
    			add_location(h1, file$7, 8, 2, 199);
    			attr_dev(div, "class", "flex-grow mx-auto flex items-center justify-center flex-column h-96");
    			add_location(div, file$7, 5, 0, 112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*user*/ 1) set_data_dev(t1, /*user*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index', slots, []);
    	let { user = new Date().toLocaleString("en-us", { weekday: "long" }) } = $$props;
    	const writable_props = ['user'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	$$self.$capture_state = () => ({ user });

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { user: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get user() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Page\NotFound.svelte generated by Svelte v3.42.1 */

    const file$6 = "src\\components\\Page\\NotFound.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let h2;
    	let t2;
    	let a;
    	let t3_value = /*link*/ ctx[0].label + "";
    	let t3;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "404";
    			t1 = space();
    			h2 = element("h2");
    			t2 = text("Hello there, The page you're looking for is nonexistent. Here is the link to\n    ");
    			a = element("a");
    			t3 = text(t3_value);
    			attr_dev(h1, "class", "font-sans tracking-tight font-bold text-xl mb-10");
    			add_location(h1, file$6, 10, 2, 192);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[0].url);
    			add_location(a, file$6, 13, 4, 405);
    			attr_dev(h2, "class", "font-sans tracking-tight font-bold text-lg");
    			add_location(h2, file$6, 11, 2, 264);
    			attr_dev(div, "class", "h-screen w-screen mx-auto flex flex-grow items-center justify-center flex-column");
    			add_location(div, file$6, 7, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, h2);
    			append_dev(h2, t2);
    			append_dev(h2, a);
    			append_dev(a, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*link*/ 1 && t3_value !== (t3_value = /*link*/ ctx[0].label + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*link*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[0].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotFound', slots, []);
    	
    	let { link = { label: "Home", url: "/" } } = $$props;
    	const writable_props = ['link'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('link' in $$props) $$invalidate(0, link = $$props.link);
    	};

    	$$self.$capture_state = () => ({ link });

    	$$self.$inject_state = $$props => {
    		if ('link' in $$props) $$invalidate(0, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [link];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { link: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get link() {
    		throw new Error("<NotFound>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<NotFound>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const baseURI = "https://www.googleapis.com/blogger/v3/blogs/3668625331368011796/";
    /**
     * @param params
     */
    async function getPost(params) {
        const response = await fetch(baseURI + "posts?" + new URLSearchParams(Object.assign({}, params)).toString());
        if (response.ok) {
            const data = await response.json();
            return Promise.resolve(data);
        }
        else {
            return Promise.reject(new Error("no post found"));
        }
    }

    /* src\components\Placeholder\CardPlaceholder.svelte generated by Svelte v3.42.1 */

    const file$5 = "src\\components\\Placeholder\\CardPlaceholder.svelte";

    function create_fragment$6(ctx) {
    	let div9;
    	let div8;
    	let div0;
    	let t0;
    	let div7;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let span0;
    	let t6;
    	let span1;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div7 = element("div");
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			span0 = element("span");
    			t6 = space();
    			span1 = element("span");
    			attr_dev(div0, "class", "lg:h-48 md:h-36 w-full object-cover object-center flex align-center justify-center bg-gray-100");
    			add_location(div0, file$5, 2, 4, 115);
    			attr_dev(div1, "class", "bg-gray-400 animate-pulse h-4 w-1/4 mb-2");
    			add_location(div1, file$5, 6, 6, 264);
    			attr_dev(div2, "class", "w-1/2 mb-4 h-6 animate-pulse bg-gray-500");
    			add_location(div2, file$5, 7, 6, 331);
    			attr_dev(div3, "class", "leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400");
    			add_location(div3, file$5, 8, 6, 398);
    			attr_dev(div4, "class", "leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400");
    			add_location(div4, file$5, 9, 6, 482);
    			attr_dev(div5, "class", "leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400");
    			add_location(div5, file$5, 10, 6, 565);
    			attr_dev(span0, "class", "bg-indigo-300 h-4 animate-pulse mt-2 w-32 inline-flex items-center md:mb-2 lg:mb-0");
    			add_location(span0, file$5, 12, 8, 699);
    			attr_dev(span1, "class", "bg-indigo-300 w-16 mt-2 h-4 animate-pulse mr-3 px-2 inline-flex items-center ml-auto leading-none text-sm pr-5 py-1");
    			add_location(span1, file$5, 15, 8, 831);
    			attr_dev(div6, "class", "flex items-center flex-wrap ");
    			add_location(div6, file$5, 11, 6, 648);
    			attr_dev(div7, "class", "p-6");
    			add_location(div7, file$5, 5, 4, 240);
    			attr_dev(div8, "class", "h-full border-2 border-gray-200 rounded-lg overflow-hidden");
    			add_location(div8, file$5, 1, 2, 38);
    			attr_dev(div9, "class", "p-4 md:w-1/2 lg:w-1/3");
    			add_location(div9, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div8, t0);
    			append_dev(div8, div7);
    			append_dev(div7, div1);
    			append_dev(div7, t1);
    			append_dev(div7, div2);
    			append_dev(div7, t2);
    			append_dev(div7, div3);
    			append_dev(div7, t3);
    			append_dev(div7, div4);
    			append_dev(div7, t4);
    			append_dev(div7, div5);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			append_dev(div6, span0);
    			append_dev(div6, t6);
    			append_dev(div6, span1);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardPlaceholder', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardPlaceholder> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class CardPlaceholder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardPlaceholder",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Card\Card.svelte generated by Svelte v3.42.1 */

    const file$4 = "src\\components\\Card\\Card.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (29:6) {#each article.labels as label}
    function create_each_block$2(ctx) {
    	let span;
    	let t_value = /*label*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "tracking-widest text-xs title-font font-medium text-gray-500 mb-1 mr-2");
    			add_location(span, file$4, 29, 8, 851);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*article*/ 1 && t_value !== (t_value = /*label*/ ctx[1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(29:6) {#each article.labels as label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let li;
    	let article_1;
    	let div0;
    	let svg0;
    	let rect;
    	let circle0;
    	let polyline0;
    	let t0;
    	let div2;
    	let t1;
    	let h2;
    	let t2_value = /*article*/ ctx[0].title + "";
    	let t2;
    	let t3;
    	let p;
    	let raw_value = /*article*/ ctx[0].content + "";
    	let t4;
    	let div1;
    	let a;
    	let t5;
    	let svg1;
    	let path0;
    	let path1;
    	let a_href_value;
    	let t6;
    	let span0;
    	let svg2;
    	let circle1;
    	let polyline1;
    	let t7_value = new Date(/*article*/ ctx[0].published).toDateString() + "";
    	let t7;
    	let t8;
    	let span1;
    	let svg3;
    	let path2;
    	let t9_value = /*article*/ ctx[0].replies.totalItems + "";
    	let t9;
    	let each_value = /*article*/ ctx[0].labels;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			article_1 = element("article");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			rect = svg_element("rect");
    			circle0 = svg_element("circle");
    			polyline0 = svg_element("polyline");
    			t0 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			h2 = element("h2");
    			t2 = text(t2_value);
    			t3 = space();
    			p = element("p");
    			t4 = space();
    			div1 = element("div");
    			a = element("a");
    			t5 = text("Read More\n          ");
    			svg1 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t6 = space();
    			span0 = element("span");
    			svg2 = svg_element("svg");
    			circle1 = svg_element("circle");
    			polyline1 = svg_element("polyline");
    			t7 = text(t7_value);
    			t8 = space();
    			span1 = element("span");
    			svg3 = svg_element("svg");
    			path2 = svg_element("path");
    			t9 = text(t9_value);
    			attr_dev(rect, "x", "3");
    			attr_dev(rect, "y", "3");
    			attr_dev(rect, "width", "18");
    			attr_dev(rect, "height", "18");
    			attr_dev(rect, "rx", "2");
    			attr_dev(rect, "ry", "2");
    			add_location(rect, file$4, 20, 9, 589);
    			attr_dev(circle0, "cx", "8.5");
    			attr_dev(circle0, "cy", "8.5");
    			attr_dev(circle0, "r", "1.5");
    			add_location(circle0, file$4, 20, 66, 646);
    			attr_dev(polyline0, "points", "21 15 16 10 5 21");
    			add_location(polyline0, file$4, 24, 10, 720);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "24");
    			attr_dev(svg0, "height", "24");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			attr_dev(svg0, "class", "m-auto block");
    			add_location(svg0, file$4, 9, 6, 298);
    			attr_dev(div0, "class", "w-full h-48 h-36 object-cover object-center flex align-center justify-center bg-gray-100");
    			add_location(div0, file$4, 6, 4, 178);
    			attr_dev(h2, "class", "title-font text-lg font-medium text-gray-900 mb-3");
    			add_location(h2, file$4, 35, 6, 1010);
    			attr_dev(p, "class", "leading-relaxed mb-3 h-full md:h-35 lg:h-40 overflow-hidden");
    			add_location(p, file$4, 38, 6, 1115);
    			attr_dev(path0, "d", "M5 12h14");
    			add_location(path0, file$4, 55, 12, 1677);
    			attr_dev(path1, "d", "M12 5l7 7-7 7");
    			add_location(path1, file$4, 56, 12, 1711);
    			attr_dev(svg1, "class", "w-4 h-4 ml-2");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke-linecap", "round");
    			attr_dev(svg1, "stroke-linejoin", "round");
    			add_location(svg1, file$4, 46, 10, 1425);
    			attr_dev(a, "class", "text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0");
    			attr_dev(a, "href", a_href_value = /*article*/ ctx[0].url);
    			add_location(a, file$4, 42, 8, 1287);
    			attr_dev(circle1, "cx", "12");
    			attr_dev(circle1, "cy", "12");
    			attr_dev(circle1, "r", "10");
    			add_location(circle1, file$4, 73, 13, 2284);
    			attr_dev(polyline1, "points", "12 6 12 12 16 14");
    			add_location(polyline1, file$4, 73, 46, 2317);
    			attr_dev(svg2, "class", "w-4 h-4 mr-1");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "width", "24");
    			attr_dev(svg2, "height", "24");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "stroke", "currentColor");
    			attr_dev(svg2, "stroke-width", "2");
    			attr_dev(svg2, "stroke-linecap", "round");
    			attr_dev(svg2, "stroke-linejoin", "round");
    			add_location(svg2, file$4, 62, 10, 1949);
    			attr_dev(span0, "class", "text-gray-600 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-300");
    			add_location(span0, file$4, 59, 8, 1776);
    			attr_dev(path2, "d", "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z");
    			add_location(path2, file$4, 90, 12, 2823);
    			attr_dev(svg3, "class", "w-4 h-4 mr-1");
    			attr_dev(svg3, "stroke", "currentColor");
    			attr_dev(svg3, "stroke-width", "2");
    			attr_dev(svg3, "fill", "none");
    			attr_dev(svg3, "stroke-linecap", "round");
    			attr_dev(svg3, "stroke-linejoin", "round");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			add_location(svg3, file$4, 81, 10, 2571);
    			attr_dev(span1, "class", "text-gray-600 inline-flex items-center leading-none text-sm");
    			add_location(span1, file$4, 78, 8, 2467);
    			attr_dev(div1, "class", "flex items-center flex-wrap ");
    			add_location(div1, file$4, 41, 6, 1236);
    			attr_dev(div2, "class", "p-6");
    			add_location(div2, file$4, 27, 4, 787);
    			attr_dev(article_1, "class", "h-full border-2 border-gray-200 rounded-lg overflow-hidden");
    			add_location(article_1, file$4, 5, 2, 97);
    			attr_dev(li, "class", "p-4 w-full md:w-1/2 lg:w-1/3");
    			add_location(li, file$4, 4, 0, 53);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, article_1);
    			append_dev(article_1, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, rect);
    			append_dev(svg0, circle0);
    			append_dev(svg0, polyline0);
    			append_dev(article_1, t0);
    			append_dev(article_1, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, h2);
    			append_dev(h2, t2);
    			append_dev(div2, t3);
    			append_dev(div2, p);
    			p.innerHTML = raw_value;
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(a, t5);
    			append_dev(a, svg1);
    			append_dev(svg1, path0);
    			append_dev(svg1, path1);
    			append_dev(div1, t6);
    			append_dev(div1, span0);
    			append_dev(span0, svg2);
    			append_dev(svg2, circle1);
    			append_dev(svg2, polyline1);
    			append_dev(span0, t7);
    			append_dev(div1, t8);
    			append_dev(div1, span1);
    			append_dev(span1, svg3);
    			append_dev(svg3, path2);
    			append_dev(span1, t9);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*article*/ 1) {
    				each_value = /*article*/ ctx[0].labels;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*article*/ 1 && t2_value !== (t2_value = /*article*/ ctx[0].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*article*/ 1 && raw_value !== (raw_value = /*article*/ ctx[0].content + "")) p.innerHTML = raw_value;
    			if (dirty & /*article*/ 1 && a_href_value !== (a_href_value = /*article*/ ctx[0].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*article*/ 1 && t7_value !== (t7_value = new Date(/*article*/ ctx[0].published).toDateString() + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*article*/ 1 && t9_value !== (t9_value = /*article*/ ctx[0].replies.totalItems + "")) set_data_dev(t9, t9_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	
    	let { article } = $$props;
    	const writable_props = ['article'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    	};

    	$$self.$capture_state = () => ({ article });

    	$$self.$inject_state = $$props => {
    		if ('article' in $$props) $$invalidate(0, article = $$props.article);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [article];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { article: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*article*/ ctx[0] === undefined && !('article' in props)) {
    			console.warn("<Card> was created without expected prop 'article'");
    		}
    	}

    	get article() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Blog\Blog.svelte generated by Svelte v3.42.1 */
    const file$3 = "src\\components\\Blog\\Blog.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (14:2) {:else}
    function create_else_block(ctx) {
    	let ul;
    	let current;
    	let each_value = /*$queryResult*/ ctx[0].data.items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "flex flex-wrap");
    			add_location(ul, file$3, 14, 4, 560);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$queryResult*/ 1) {
    				each_value = /*$queryResult*/ ctx[0].data.items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(14:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:31) 
    function create_if_block_1(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*$queryResult*/ ctx[0].error.message + "";
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("An error has occurred: ");
    			t1 = text(t1_value);
    			add_location(span, file$3, 12, 4, 481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$queryResult*/ 1 && t1_value !== (t1_value = /*$queryResult*/ ctx[0].error.message + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(12:31) ",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if $queryResult.isLoading}
    function create_if_block$1(ctx) {
    	let cardplaceholder;
    	let current;
    	cardplaceholder = new CardPlaceholder({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(cardplaceholder.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardplaceholder, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardplaceholder.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardplaceholder.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardplaceholder, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:2) {#if $queryResult.isLoading}",
    		ctx
    	});

    	return block;
    }

    // (16:6) {#each $queryResult.data.items as article}
    function create_each_block$1(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: { article: /*article*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*$queryResult*/ 1) card_changes.article = /*article*/ ctx[2];
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(16:6) {#each $queryResult.data.items as article}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$queryResult*/ ctx[0].isLoading) return 0;
    		if (/*$queryResult*/ ctx[0].error) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "id", "blog-wrapper");
    			attr_dev(div, "class", "container");
    			add_location(div, file$3, 8, 0, 348);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $queryResult;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blog', slots, []);
    	

    	const queryResult = useQuery("posts", () => getPost({
    		key: "AIzaSyDIttGBCphjqlpxEt-_A76faDaDJWb5rGQ"
    	}));

    	validate_store(queryResult, 'queryResult');
    	component_subscribe($$self, queryResult, value => $$invalidate(0, $queryResult = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blog> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		useQuery,
    		getPost,
    		CardPlaceholder,
    		Card,
    		queryResult,
    		$queryResult
    	});

    	return [$queryResult, queryResult];
    }

    class Blog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Navbar\Navbar.svelte generated by Svelte v3.42.1 */

    const file$2 = "src\\components\\Navbar\\Navbar.svelte";

    function create_fragment$3(ctx) {
    	let header;
    	let div3;
    	let div2;
    	let div1;
    	let nav;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let button;
    	let span0;
    	let t1;
    	let span1;
    	let t2;
    	let span2;
    	let t3;
    	let div0;
    	let ul;
    	let li0;
    	let a1;
    	let t5;
    	let li1;
    	let a2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			nav = element("nav");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			button = element("button");
    			span0 = element("span");
    			t1 = space();
    			span1 = element("span");
    			t2 = space();
    			span2 = element("span");
    			t3 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Home";
    			t5 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Blog";
    			if (!src_url_equal(img.src, img_src_value = "logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*name*/ ctx[0]);
    			attr_dev(img, "class", "h-10 w-10");
    			add_location(img, file$2, 19, 12, 472);
    			attr_dev(a0, "class", "navbar-brand mr-5");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$2, 18, 10, 421);
    			attr_dev(span0, "class", "toggler-icon svelte-ewl27k");
    			add_location(span0, file$2, 29, 12, 827);
    			attr_dev(span1, "class", "toggler-icon svelte-ewl27k");
    			add_location(span1, file$2, 30, 12, 869);
    			attr_dev(span2, "class", "toggler-icon svelte-ewl27k");
    			add_location(span2, file$2, 31, 12, 911);
    			attr_dev(button, "class", "block navbar-toggler focus:outline-none lg:hidden");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-controls", "navbarOne");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file$2, 21, 10, 549);
    			attr_dev(a1, "class", "mb-5");
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$2, 44, 16, 1474);
    			attr_dev(li0, "class", "nav-item ml-5 lg:ml-11");
    			add_location(li0, file$2, 43, 14, 1422);
    			attr_dev(a2, "class", "mb-5");
    			attr_dev(a2, "href", "/blog");
    			add_location(a2, file$2, 47, 16, 1594);
    			attr_dev(li1, "class", "nav-item ml-5 lg:ml-11");
    			add_location(li1, file$2, 46, 14, 1542);
    			attr_dev(ul, "id", "nav");
    			attr_dev(ul, "class", "items-center content-start mr-auto lg:justify-end lg:flex");
    			add_location(ul, file$2, 38, 12, 1250);
    			attr_dev(div0, "class", "absolute left-0 z-20 hidden w-full px-5 py-3 duration-300 bg-white lg:w-auto lg:block top-full mt-full lg:static lg:bg-transparent shadow lg:shadow-none");
    			toggle_class(div0, "hidden", !/*buttonClose*/ ctx[1]);
    			toggle_class(div0, "ml-7", /*buttonClose*/ ctx[1]);
    			add_location(div0, file$2, 33, 10, 971);
    			attr_dev(nav, "class", "flex items-center justify-between py-4 svelte-ewl27k");
    			toggle_class(nav, "active", /*buttonClose*/ ctx[1]);
    			add_location(nav, file$2, 14, 8, 302);
    			attr_dev(div1, "class", "w-full");
    			add_location(div1, file$2, 13, 6, 273);
    			attr_dev(div2, "class", "row items-center");
    			add_location(div2, file$2, 12, 4, 236);
    			attr_dev(div3, "class", "container relative mx-auto");
    			add_location(div3, file$2, 11, 2, 191);
    			attr_dev(header, "class", "navbar bg-white sticky");
    			add_location(header, file$2, 10, 0, 149);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(a0, img);
    			append_dev(nav, t0);
    			append_dev(nav, button);
    			append_dev(button, span0);
    			append_dev(button, t1);
    			append_dev(button, span1);
    			append_dev(button, t2);
    			append_dev(button, span2);
    			append_dev(nav, t3);
    			append_dev(nav, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(li1, a2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*handleClick*/ ctx[2], false, false, false),
    					listen_dev(ul, "click", /*handleClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) {
    				attr_dev(img, "alt", /*name*/ ctx[0]);
    			}

    			if (dirty & /*buttonClose*/ 2) {
    				toggle_class(div0, "hidden", !/*buttonClose*/ ctx[1]);
    			}

    			if (dirty & /*buttonClose*/ 2) {
    				toggle_class(div0, "ml-7", /*buttonClose*/ ctx[1]);
    			}

    			if (dirty & /*buttonClose*/ 2) {
    				toggle_class(nav, "active", /*buttonClose*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let { name } = $$props;
    	let buttonClose = false;

    	/**
     *
     */
    	function handleClick() {
    		$$invalidate(1, buttonClose = !buttonClose);
    	}

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name, buttonClose, handleClick });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('buttonClose' in $$props) $$invalidate(1, buttonClose = $$props.buttonClose);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, buttonClose, handleClick];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Navbar> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Footer\Footer.svelte generated by Svelte v3.42.1 */

    const file$1 = "src\\components\\Footer\\Footer.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (9:4) {#if icons.length !== 0}
    function create_if_block(ctx) {
    	let ul;
    	let each_value = /*icons*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "flex justify-center sm:justify-start");
    			add_location(ul, file$1, 9, 6, 256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icons*/ 1) {
    				each_value = /*icons*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(9:4) {#if icons.length !== 0}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each icons as icon}
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let raw_value = /*icon*/ ctx[1].content + "";
    	let a_href_value;
    	let a_title_value;
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = space();
    			attr_dev(a, "href", a_href_value = /*icon*/ ctx[1].url);
    			attr_dev(a, "title", a_title_value = /*icon*/ ctx[1].title);
    			add_location(a, file$1, 12, 12, 376);
    			attr_dev(li, "class", "mr-3");
    			add_location(li, file$1, 11, 10, 346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			a.innerHTML = raw_value;
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icons*/ 1 && raw_value !== (raw_value = /*icon*/ ctx[1].content + "")) a.innerHTML = raw_value;
    			if (dirty & /*icons*/ 1 && a_href_value !== (a_href_value = /*icon*/ ctx[1].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*icons*/ 1 && a_title_value !== (a_title_value = /*icon*/ ctx[1].title)) {
    				attr_dev(a, "title", a_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:8) {#each icons as icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let footer;
    	let div0;
    	let t0;
    	let div1;
    	let p;
    	let t1;
    	let a;
    	let if_block = /*icons*/ ctx[0].length !== 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			p = element("p");
    			t1 = text("Crafted by ");
    			a = element("a");
    			a.textContent = "mcseptian";
    			attr_dev(div0, "class", "pt-4 mx-3 text-center");
    			add_location(div0, file$1, 7, 2, 185);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "rel", "nofollow");
    			attr_dev(a, "title", "author");
    			attr_dev(a, "class", "text-gray-400 hover:text-gray-700");
    			add_location(a, file$1, 20, 17, 607);
    			attr_dev(p, "class", "text-gray-400");
    			add_location(p, file$1, 19, 4, 564);
    			attr_dev(div1, "class", "footer_copyright_content pt-4 text-center");
    			add_location(div1, file$1, 18, 2, 504);
    			attr_dev(footer, "class", "container mx-auto pt-3 pb-6 border-t-2 border-solid border-white border-opacity-10 sm:flex justify-between");
    			add_location(footer, file$1, 4, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(footer, t0);
    			append_dev(footer, div1);
    			append_dev(div1, p);
    			append_dev(p, t1);
    			append_dev(p, a);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*icons*/ ctx[0].length !== 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	
    	let { icons = [] } = $$props;
    	const writable_props = ['icons'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('icons' in $$props) $$invalidate(0, icons = $$props.icons);
    	};

    	$$self.$capture_state = () => ({ icons });

    	$$self.$inject_state = $$props => {
    		if ('icons' in $$props) $$invalidate(0, icons = $$props.icons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icons];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { icons: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get icons() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icons(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\layout\MainLayout.svelte generated by Svelte v3.42.1 */
    const file = "src\\layout\\MainLayout.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let navbar;
    	let t0;
    	let main;
    	let route;
    	let t1;
    	let footer;
    	let current;
    	navbar = new Navbar({ props: { name: "ian" }, $$inline: true });

    	route = new Route({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0],
    				params: /*params*/ ctx[1]
    			},
    			$$inline: true
    		});

    	footer = new Footer({
    			props: { icons: /*socialIcons*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(route.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "container flex h-full w-full flex-grow mx-auto");
    			add_location(main, file, 17, 2, 932);
    			add_location(div, file, 15, 0, 900);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(navbar, div, null);
    			append_dev(div, t0);
    			append_dev(div, main);
    			mount_component(route, main, null);
    			append_dev(div, t1);
    			mount_component(footer, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0];
    			if (dirty & /*params*/ 2) route_changes.params = /*params*/ ctx[1];
    			route.$set(route_changes);
    			const footer_changes = {};
    			if (dirty & /*socialIcons*/ 4) footer_changes.icons = /*socialIcons*/ ctx[2];
    			footer.$set(footer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(route.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(route.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(navbar);
    			destroy_component(route);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainLayout', slots, []);
    	let { currentRoute } = $$props;
    	let { params = {} } = $$props;

    	let { socialIcons = [
    		{
    			kind: "github",
    			url: "https://github.com/mcseptian/",
    			title: "github",
    			content: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>'
    		}
    	] } = $$props;

    	const writable_props = ['currentRoute', 'params', 'socialIcons'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainLayout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('socialIcons' in $$props) $$invalidate(2, socialIcons = $$props.socialIcons);
    	};

    	$$self.$capture_state = () => ({
    		Route,
    		Navbar,
    		Footer,
    		currentRoute,
    		params,
    		socialIcons
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('socialIcons' in $$props) $$invalidate(2, socialIcons = $$props.socialIcons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentRoute, params, socialIcons];
    }

    class MainLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			currentRoute: 0,
    			params: 1,
    			socialIcons: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainLayout",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currentRoute*/ ctx[0] === undefined && !('currentRoute' in props)) {
    			console.warn("<MainLayout> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<MainLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<MainLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get params() {
    		throw new Error("<MainLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<MainLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get socialIcons() {
    		throw new Error("<MainLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set socialIcons(value) {
    		throw new Error("<MainLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const routes = [
        {
            name: "/",
            path: "/",
            component: Index,
            layout: MainLayout,
        },
        {
            name: "blog",
            path: "/blog",
            component: Blog,
            layout: MainLayout,
        },
        { name: "404", path: "*", component: NotFound },
    ];

    /* src\App.svelte generated by Svelte v3.42.1 */

    // (11:0) <QueryClientProvider client={queryClient}>
    function create_default_slot(ctx) {
    	let router;
    	let current;
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:0) <QueryClientProvider client={queryClient}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let queryclientprovider;
    	let current;

    	queryclientprovider = new QueryClientProvider$1({
    			props: {
    				client: /*queryClient*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(queryclientprovider.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(queryclientprovider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const queryclientprovider_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				queryclientprovider_changes.$$scope = { dirty, ctx };
    			}

    			queryclientprovider.$set(queryclientprovider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(queryclientprovider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(queryclientprovider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(queryclientprovider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const queryClient = new QueryClient();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		QueryClient,
    		QueryClientProvider: QueryClientProvider$1,
    		Router,
    		routes,
    		queryClient
    	});

    	return [queryClient];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
