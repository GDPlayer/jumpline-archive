import { useSyncExternalStore, useState, useCallback } from 'react';

// FUCKING AAAAAA
export class WebsimSocket {
    constructor() {
        this.clientId = 'user_' + Math.random().toString(36).substr(2, 5);
        this.peers = { [this.clientId]: { username: 'LocalUser', id: this.clientId } };
        this.presence = { [this.clientId]: {} };
        this.roomState = {};
        this.onmessage = null;
        this._channel = new BroadcastChannel('websim_polyfill_room');
        this._collections = {};
        this._listeners = new Set();
        this._channel.onmessage = (e) => {
            const { type, payload, from } = e.data;
            if (type === 'event' && this.onmessage) this.onmessage({ ...payload, clientId: from });
            if (type === 'presence') {
                this.presence[from] = payload;
                this._listeners.forEach(l => l.type === 'presence' && l.cb(this.presence));
            }
            if (type === 'state') {
                this.roomState = payload;
                this._listeners.forEach(l => l.type === 'state' && l.cb(this.roomState));
            }
            if (type === 'rpc' && payload.target === this.clientId) {
                this._listeners.forEach(l => l.type === 'rpc' && l.cb(payload.data, from));
            }
        };
    }
    async initialize() {
        console.log("WebsimSocket initialized");
        return this;
    }
    updatePresence(data) {
        this.presence[this.clientId] = { ...this.presence[this.clientId], ...data };
        this._channel.postMessage({ type: 'presence', from: this.clientId, payload: this.presence[this.clientId] });
    }
    updateRoomState(data) {
        for (let k in data) {
            if (data[k] === null) delete this.roomState[k];
            else this.roomState[k] = data[k];
        }
        this._channel.postMessage({ type: 'state', from: this.clientId, payload: this.roomState });
    }
    send(payload) { this._channel.postMessage({ type: 'event', from: this.clientId, payload }); }
    requestPresenceUpdate(target, data) {
        this._channel.postMessage({ type: 'rpc', from: this.clientId, payload: { target, data } });
    }
    subscribePresence(cb) { return this._sub('presence', cb); }
    subscribeRoomState(cb) { return this._sub('state', cb); }
    subscribePresenceUpdateRequests(cb) { return this._sub('rpc', cb); }
    _sub(type, cb) {
        const obj = { type, cb };
        this._listeners.add(obj);
        return () => this._listeners.delete(obj);
    }
    query() {
        console.log("SQL parsing goes here");
    }
    collection(name) {
        if (!this._collections[name]) {
            const storageKey = `websim_polyfill_collection_${name}`;
            const getData = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
            this._collections[name] = {
                create: async (item) => {
                    const rec = { id: Math.random().toString(36).slice(2), ...item, _owner: true };
                    const data = [rec, ...getData()];
                    localStorage.setItem(storageKey, JSON.stringify(data));
                    return rec;
                },
                getList: () => getData(),
                update: async (id, patch) => {
                    const data = getData().map(i => i.id === id ? { ...i, ...patch } : i);
                    localStorage.setItem(storageKey, JSON.stringify(data));
                },
                delete: async (id) => {
                    const data = getData().filter(i => i.id !== id);
                    localStorage.setItem(storageKey, JSON.stringify(data));
                },
                upsert: async (idOrItem, maybeItem) => {
                    let id, item;

                    // Check if the first argument is an object that HAS an 'id' property
                    if (typeof idOrItem === 'object' && idOrItem !== null && idOrItem.id) {
                        id = idOrItem.id;    // Extract the ID from the object
                        item = idOrItem;    // Use the whole object as the item
                    } else {
                        id = idOrItem;      // Standard behavior (id is the first arg)
                        item = maybeItem;    // Standard behavior (item is the second arg)
                    }

                    const data = getData();
                    const index = data.findIndex(i => i.id === id);

                    let newData;
                    if (index !== -1) {
                        // Update: Merge existing with new
                        newData = data.map(i => i.id === id ? { ...i, ...item } : i);
                    } else {
                        // Insert: Add new entry
                        newData = [...data, { ...item, id, _owner: true }];
                    }

                    localStorage.setItem(storageKey, JSON.stringify(newData));
                },
                filter: (predicate) => {
                    return {
                        getList: () => {
                            const data = getData();
                            // If predicate is missing or not a function, return everything
                            if (typeof predicate !== 'function') {
                                return data;
                            }
                            return data.filter(predicate);
                        }
                    };
                },
                _clearData: () => {
                    localStorage.setItem(storageKey, JSON.stringify([]));
                    window.location.reload();
                }
            };
        }
        return this._collections[name];
    }
}
// a special level of masochism
window.WebsimSocket = WebsimSocket;
window.websim = {
    getCurrentUser: async () => ({ id: 'u1', username: 'Rick Astley' }),
    getCreator: async () => ({ id: 'c1', username: 'websim_polyfill' }),
    getCurrentProject: async () => ({ id: 'p1', title: 'websim_polyfill' }),
    chat: { completions: { create: async (p) => { alert("AI features are unavailable, read websim-polyfill.txt for more information"); return {}; } } },
    imageGen: async (p) => { alert("AI features are unavailable, read websim-polyfill.txt for more information"); return {}; },
    textToSpeech: async (p) => { alert("AI features are unavailable, read websim-polyfill.txt for more information"); return {}; },
    upload: async (file) => URL.createObjectURL(file),
    postComment: async (c) => {
        const event = new CustomEvent('websim:comment:created', {
            detail: { comment: { raw_content: c.content, author: { username: 'me' }, created_at: new Date().toISOString() } }
        });
        window.dispatchEvent(event);
        return { success: true };
    },
    addEventListener: (name, cb) => window.addEventListener(`websim:${name}`, (e) => cb(e.detail)),
    removeEventListener: (name, cb) => window.removeEventListener(`websim:${name}`, cb)
};
export function useQuery(collection) {
    const [loading, setLoading] = useState(true);

    const subscribe = useCallback((callback) => {
        setLoading(false);
        const unsubscribe = collection?.subscribe(() => {
            callback();
        });
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }, [collection]);

    const getSnapshot = useCallback(() => {
        return collection?.getList();
    }, [collection]);

    const data = useSyncExternalStore(subscribe, getSnapshot);

    return { data, loading };
}

export default WebsimSocket;