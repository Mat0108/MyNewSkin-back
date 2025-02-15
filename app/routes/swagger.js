module.exports = () => {
    /**
     * @swagger
     * 
     *  components:
     *      schema:
     *          email:
     *              type: string
     *          error:
     *              message:
     *                  type: string
     *          tokenvalide:
     *              type: object
     *              properties: 
     *                  succes:
     *                      type: boolean
     *                      default: true
     *          tokeninvalide:
     *              type: object
     *              properties: 
     *                  succes:
     *                      type: boolean
     *                      default: false 
     *          blog:
     *              type: object
     *              properties: 
     *                  title:
     *                      type: string
     *                  imagepresentation:
     *                      type: string
     *                  altimagepresentation:
     *                      type: string
     *                  textpresentation:
     *                      type: string
     *                  titlelist:
     *                      type: array
     *                      items:
     *                          type: string
     *                  textlist:
     *                      type: array
     *                      items:
     *                          type: string
     *                  imagelist:
     *                      type: array
     *                      items:
     *                          type: string
     *                  altimage:
     *                      type: array
     *                      items:
     *                          type: string
     *                  textcolor:
     *                      type: array
     *                      items:
     *                          type: string
     *                  layout:
     *                      type: array
     *                      items:
     *                          type: string
     *                  margin:
     *                      type: string
     *
     *          form:
     *              type: object
     *              properties: 
     *                  mail:
     *                      type: string
     *                  date:
     *                      type: date
     *                  question1:
     *                      type: array
     *                      items:
     *                          type: number
     *                  question2:
     *                      type: array
     *                      items:
     *                          type: number
     *                  question3:
     *                      type: array
     *                      items:
     *                          type: number
     *                  question4:
     *                      type: array
     *                      items:
     *                          type: number
     *                  question5:
     *                      type: array
     *                      items:
     *                          type: number
     *                  language:
     *                      type: string
     *          rdv:
     *              type: object
     *              properties: 
     *                  DateDebut:
     *                      type: string
     *                      format: date
     *                  DateFin:
     *                      type: string
     *                      format: date
     *                  Confirmation:
     *                      type: boolean
     *                  Type:
     *                      type: boolean
     *                  CompteClient:
     *                      type: string
     *                      format: objectId
     *                  CompteExpert:
     *                      type: string
     *                      format: objectId
     *                  Observation:
     *                      type: string
     *          rdvcreation:
     *              type: object
     *              properties: 
     *                  DateDebut:
     *                      type: date
     *                  Type:
     *                      type: boolean
     *                  CompteClient:
     *                      type: string
     *                  CompteExpert:
     *                      type: string
     *          user:
     *              type: object
     *              properties: 
     *                  firstname:
     *                      type: string
     *                  lastname:
     *                      type: string
     *                  email:
     *                      type: string
     *                  password:
     *                      type: string
     *                  type:
     *                      type: number
     *                  imageBase64:
     *                      type: string
     *                  adresse:
     *                      type: string
     *                  ville:
     *                      type: string
     *                  codepostal:
     *                      type: string
     *                  telephone:
     *                      type: string
     *                  showDermatologue:
     *                      type: boolean
     *                  allergiestype:
     *                      type: boolean
     *                  allergies:
     *                      type: string
     *                  sexe:
     *                      type: string
     * 
     */
}
