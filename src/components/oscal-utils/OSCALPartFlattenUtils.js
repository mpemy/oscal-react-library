/**
 * Flatten an object containing nested `parts` attributes to a list of objects.
 *
 * This does not modify the objects higher in the hierarchy (so the embedded
 * parts are not removed or 'popped' after being evaluated). This is effectively
 * a tree traversal.
 *
 * @param rootObject
 */
export default function flattenNestedPartsToList(rootObject) {
  return [
    // Putting [rootObject] first effectively makes this a preorder traversal; it
    // could be postorder if the two lines were flipped.
    rootObject,
    ...(rootObject?.parts?.flatMap(flattenNestedPartsToList) ?? []),
  ];
}
