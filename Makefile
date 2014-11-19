MODULE  = Miniflux
FILENAME = miniflux
EXPORT  = $(MODULE)
BUILD_DIR = dist
BUILD_FILE = $(BUILD_DIR)/$(FILENAME).js
BUILD_FILE_MIN = $(BUILD_DIR)/$(FILENAME).min.js

.PHONY: all clean test

all: $(BUILD_FILE) $(BUILD_FILE_MIN)

clean:
	rm -rf $(BUILD_DIR)

test:
	mocha

$(BUILD_FILE): index.js
	mkdir $(BUILD_DIR)
	browserify index.js --standalone '$(MODULE)' | derequire > $(BUILD_FILE)

$(BUILD_FILE_MIN): $(BUILD_FILE)
	uglifyjs -o $(BUILD_FILE_MIN) $(BUILD_FILE)
