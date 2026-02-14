## Multiplayer (WebsimSocket)


### `room.initialize()`

Initializes the socket connection and synchronizes the initial room state and presence.

* **Usage:** `await room.initialize();`
* **Returns:** `Promise<void>`

### `room.updatePresence(data)`

Updates the current player's own metadata (position, health, etc.) visible to all peers.

* **Usage:** `room.updatePresence({ x: 10, y: 20, status: "online" });`
* **Returns:** `void`

### `room.updateRoomState(data)`

Updates shared world state. Merges the provided object with the current state. Use `null` to delete keys.

* **Usage:** `room.updateRoomState({ scores: { "player1": 100 } });`
* **Returns:** `void`

### `room.requestPresenceUpdate(id, data)`

Requests a specific peer to update their presence. Useful for "damage" or remote triggers.

* **Usage:** `room.requestPresenceUpdate(targetId, { type: "hit", amount: 10 });`
* **Returns:** `void`

### `room.subscribePresence(cb)`

Subscribes to any presence changes from any peer in the room.

* **Usage:** `const unsub = room.subscribePresence((presence) => console.log(presence));`
* **Returns:** `Unsubscribe Function`

### `room.subscribeRoomState(cb)`

Subscribes to changes in the shared room state.

* **Usage:** `const unsub = room.subscribeRoomState((state) => console.log(state));`
* **Returns:** `Unsubscribe Function`

### `room.subscribePresenceUpdateRequests(cb)`

Listens for requests from other peers to update your own presence.

* **Usage:** `room.subscribePresenceUpdateRequests((req, fromId) => handle(req));`
* **Returns:** `Unsubscribe Function`

### `room.send(event)`

Broadcasts an ephemeral event (like a sound effect trigger) to all peers.

* **Usage:** `room.send({ type: "explosion", x: 100, y: 100 });`
* **Returns:** `void`

---

## 🗄️ Database (Records)

### `room.collection(name)`

Returns a collection instance for persistent data storage.

* **Usage:** `const posts = room.collection("posts_v1");`
* **Returns:** `Collection`

### `coll.create(data)`

Creates a new persistent record in the collection.

* **Usage:** `await posts.create({ content: "Hello world" });`
* **Returns:** `Promise<Record>`

### `coll.getList()`

Fetches all records in the collection, sorted newest to oldest.

* **Usage:** `const allPosts = posts.getList();`
* **Returns:** `Record[]`

### `coll.filter(query)`

Filters the collection records by specific field equality.

* **Usage:** `const myPosts = posts.filter({ user_id: "123" }).getList();`
* **Returns:** `FilteredCollection`

### `coll.update(id, data)`

Updates an existing record. **Note:** You can only update records you created.

* **Usage:** `await posts.update(postId, { content: "Updated!" });`
* **Returns:** `Promise<void>`

### `coll.delete(id)`

Deletes a record. **Note:** You can only delete records you created.

* **Usage:** `await posts.delete(postId);`
* **Returns:** `Promise<void>`

### `coll.subscribe(cb)`

Subscribes to live changes in the collection or a filtered subset.

* **Usage:** `posts.subscribe((list) => render(list));`
* **Returns:** `Unsubscribe Function`

---

## 🤖 AI & Generation

### `websim.chat.completions.create(params)`

Generates text or JSON responses using an LLM.

* **Usage:**
```javascript
const res = await websim.chat.completions.create({
messages: [{ role: "user", content: "Hello" }]
});
```

* **Returns:** `Promise<Completion>`

### `websim.imageGen(params)`

Generates an image from a text prompt.

* **Usage:** 
```javascript
const img = await websim.imageGen({
prompt: "A futuristic city",
aspect_ratio: "16:9"
});
```

* **Returns:** `Promise<{ url: string }>`

### `websim.textToSpeech(params)`

Converts text into an MP3 audio stream via ElevenLabs.

* **Usage:** 
```javascript
const audio = await websim.textToSpeech({
text: "Welcome to websim",
voice: "en-male"
});
```

* **Returns:** `Promise<{ url: string }>`

### `websim.upload(file)`

Uploads a File object or Blob to Websim S3 storage.

* **Usage:** `const url = await websim.upload(fileHandle);`
* **Returns:** `Promise<string>`

---

## 💬 Comments & Social

### `websim.postComment(params)`

Opens the comment UI to post a new comment or reply.

* **Usage:** 
```javascript
websim.postComment({
content: "Great project!",
credits: 10
});
```

* **Returns:** `Promise<{ error?: string }>`

### `websim.getCurrentProject()`

Gets metadata for the current project.

* **Usage:** `const project = await websim.getCurrentProject();`
* **Returns:** `Promise<Project>`

### `websim.getCurrentUser()`

Gets metadata for the user currently viewing the page.

* **Usage:** `const user = await websim.getCurrentUser();`
* **Returns:** `Promise<User>`

### `websim.getCreator()`

Gets metadata for the user who created this project.

* **Usage:** `const creator = await websim.getCreator();`
* **Returns:** `Promise<User>`

### `websim.addEventListener("comment:created", cb)`

Listen for real-time comment events.

* **Usage:** `websim.addEventListener("comment:created", (e) => console.log(e.comment));`
* **Returns:** `void`

---

## 📹 Video (Remotion)

### `useCurrentFrame()`

Hook to get the current animation frame index (starts at 0).

* **Usage:** `const frame = useCurrentFrame();`
* **Returns:** `number`

### `interpolate(val, input, output, opts)`

Maps a range of values to another range (e.g., mapping frame count to opacity).

* **Usage:** `const opacity = interpolate(frame, [0, 30], [0, 1]);`
* **Returns:** `number`

### `spring(params)`

Calculates a spring physics-based value for smooth, natural animation.

* **Usage:** `const scale = spring({ frame, fps, config: { damping: 200 } });`
* **Returns:** `number`

### `random(seed)`

A deterministic random number generator to ensure video consistency across renders.

* **Usage:** `const opacity = random("seed-1");`
* **Returns:** `number (0-1)`

### `delayRender() / continueRender()`

Ensures external assets (fonts, 3D models, etc.) are fully loaded before frames are captured.

* **Usage:** 
```javascript
const handle = delayRender();
// ... load asset ...
continueRender(handle);
```

* **Returns:** `void`