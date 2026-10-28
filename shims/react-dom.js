// Stub for react-dom inside React Native.
// The Builder SDK's block-property helper imports findDOMNode from react-dom,
// which does not exist in the RN runtime.
export function findDOMNode() {
  return null;
}

export default { findDOMNode };
