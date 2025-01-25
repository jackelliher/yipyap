.PHONY: install build start

install:
	@if ! which sox > /dev/null; then \
		if [ "$$(id -u)" != "0" ]; then \
			echo "Sox not found. Please run 'sudo make install' to install system dependencies"; \
			exit 1; \
		fi; \
		apt-get install -y sox; \
	fi
	npm install

build: install
	npm run build

start: build
	npm start

