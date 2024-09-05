(function() {
    const originalExecCommand = document.execCommand;
    document.execCommand = function(command) {
      const result = originalExecCommand.apply(this, arguments);
      if (command.toLowerCase() === 'copy') {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
          window.postMessage({ type: "CUSTOM_COPY", text: selectedText }, "*");
        }
      }
      return result;
    };
  })();