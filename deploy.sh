#!/bin/bash
git pull
docker build -t qcr.k8s.bns.co.kr/bnspace/car-frontend-web:v0.1 .
docker login --username admin --password BNSoft2020@ qcr.k8s.bns.co.kr
docker push qcr.k8s.bns.co.kr/bnspace/car-frontend-web:v0.1
kubectl delete pods -l "app=bnspace-car-frontend"

