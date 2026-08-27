.PHONY: start build test

start:
	cd frontend && npm run dev
	cd backend && python manage.py runserver

build:
	cd frontend && npm run build

test:
	cd backend && python manage.py test
