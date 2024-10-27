export const executeMethod = async (
  funcStr: string,
  args: any[],
  bindable: object
) => {
  console = __dirname = __filename = require = exports = module = undefined;
  try {
    return await eval(
      `((${funcStr}).bind(bindable))(${args.length ? args.join(",") : ""})`
    );
  } catch {
    return "errorsting";
  }
};

// todo:
// infinite loops? somehow set limits on function execution time to prevent this
// more security by isolation https://nodejs.org/api/globals.html
