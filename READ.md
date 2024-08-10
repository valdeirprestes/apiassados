#Instalacação do Api do projeto AssadosOline
#1ª Baixar o a api para seu computador 
git clone https://github.com/valdeirprestes/apiassados.git
#Se usar ssh para desenvolvimento
git clone git@github.com:valdeirprestes/apiassados.git


#2ª Entre na pasta apiassados e copie o arquivo env.example como .env ( linux )
cp env.example .env
#ou no Ms Windows
copy env.example .env

#3ª edite o arquivo .env e configura os dados de api, front e banco de dados

#4ª instale as dependencias do sistema
npm i

#Tenha certeza que configurou corretamente os dados da api, frontend e banco de dados,
#5º crie as tabelas do banco de dados
npm run createtables

#6ª Para iniciar a api em ambiente de desenvolvimento
npm run dev

#7ª Para para o servido aperte Ctrl+C

#8ª Para iniciar a api em ambiente de produção são dois comandos
npm run build
npm start

#O passo anterior inicia o ambiente em produção, mas não de forma definitiva. Precisa
#configurar alguma ferramenta como P2m

 
