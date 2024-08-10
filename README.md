#Instalacação do Api do projeto AssadosOline<br>
#1ª Baixar o a api para seu computador <br>
git clone https://github.com/valdeirprestes/apiassados.git<br>
#Se usar ssh para desenvolvimento<br>
git clone git@github.com:valdeirprestes/apiassados.git<br>
<br>
<br>
#2ª Entre na pasta apiassados e copie o arquivo env.example como .env ( linux )<br>
cp env.example .env<br>
#ou no Ms Windows<br>
copy env.example .env<br>
<br>
#3ª edite o arquivo .env e configura os dados de api, front e banco de dados<br>
<br>
#4ª instale as dependencias do sistema<br>
npm i<br>
<br>
#Tenha certeza que configurou corretamente os dados da api, frontend e banco de dados,<br>
#5º crie as tabelas do banco de dados<br>
npm run createtables<br>
<br>
#6ª Para iniciar a api em ambiente de desenvolvimento<br>
npm run dev<br>
<br>
#7ª Para para o servido aperte Ctrl+C<br>
<br>
#8ª Para iniciar a api em ambiente de produção são dois comandos<br>
npm run build<br>
npm start<br>

#O passo anterior inicia o ambiente em produção, mas não de forma definitiva. Precisa<br>
#configurar alguma ferramenta como P2m<br>

 
