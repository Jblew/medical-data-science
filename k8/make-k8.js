const {
  getNotebookDirs,
  getVersion,
  getNotebookName,
  getPackageName,
} = require("../ci.js");
const fs = require("fs");

function makeK8ConfigFiles({context}) {
    const k8OutDir = `${__dirname}/out`;
    const notebookDirs = getNotebookDirs();
    fs.mkdirSync(k8OutDir, { recursive: true });
    fs.writeFileSync(`${k8OutDir}/ingress.yml`, makeIngressConfig(notebookDirs), {
      flag: "w",
    });
    for (const notebookDir of notebookDirs) {
        const f = `${k8OutDir}/service-${getNotebookName(notebookDir)}.yml`
        fs.writeFileSync(f, makeServiceConfig(notebookDir, {context}),{flag: "w"});
    }
}

function makeIngressConfig(notebookDirs) {
    return `
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: public
    # Ingress class must be "public" instead of "nginx" because microk8s ingress is created with argument --ingress-class=public
    # Explanation: https://stackoverflow.com/questions/54506269/simple-ingress-from-host-with-microk8s
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rewrite-target: "/"
  name: medicaldatascience-ingress
spec:
  rules:
    - host: medicaldatascience.jblewandowski.com
      http:
        paths:
          ${notebookDirs.map((notebookDir) => `
          - path: "/${notebookDir}"
            pathType: Prefix
            backend:
              service:
                name: ${getNotebookServiceName(notebookDir)}
                port:
                  number: 80
          `
            )
            .join("\n")}
  tls:
    - hosts:
        - medicaldatascience.jblewandowski.com
      secretName: medicaldatascience-tls
    `;
}

function makeServiceConfig(notebookDir, { context }) {
    const serviceName = getNotebookServiceName(notebookDir)
    const imageTag = `ghcr.io/${getPackageName(notebookDir, {context})}:${getVersion(notebookDir)}`
    return `
apiVersion: v1
kind: Service
metadata:
  name: ${serviceName}
  labels: { service: ${serviceName} }
spec:
  selector: { service: ${serviceName} }
  ports: [{ port: 80, targetPort: 80 }]
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${serviceName}
  labels: { service: ${serviceName} }
spec:
  replicas: 1
  selector: { matchLabels: { service: ${serviceName} } }
  template:
    metadata: { labels: { service: ${serviceName} } }
    spec:
      restartPolicy: Always
      containers:
        - name: ${serviceName}
          image: ${imageTag}
          ports: [{ containerPort: 80 }]
          env:
            - name: PORT
              value: "80"
    `;
}

function getNotebookServiceName(notebookDir) {
    return `notebook-${getNotebookName(notebookDir)}`
}

module.exports = { makeK8ConfigFiles }