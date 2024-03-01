# Async

```typescript
const array = [1, 2, 3];
let result = 0;

await Async.each(array, async (item) => {
    // do async thing
    result += item;
});

console.log(result); // 6
```
