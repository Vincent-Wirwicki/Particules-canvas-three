export const glslAttractor = /*glsl*/ `
    
    // chen attractor  ----------------------------------
    vec3 chenAttractor(vec3 pos, float dt){     
        const float a =5.;
        const float b = -10.;
        const float c = -0.38;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = a*x - y*z;
        target.y = b*y + x*z;
        target.z = c*z + (x*y)/3.;

        return target * dt;
    } 

    // chen attractor derivative ------------------------
    vec3 chenAttractorD(vec3 pos, float t){
        const float a = 5.;
        const float b = -10.;
        const float c = -0.38;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = a - z;
        target.y = b-z;
        target.z = c + (x*y) /3.;

        return target *t;
    } 
    //----------------------------------------------------

    // halvorsen attractor -------------------------------
    vec3 HalvorsenAttractor(vec3 pos, float t){
        const float a = 1.89;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = -a*x - 4.*y - 4.*z - y*y;
        target.y = -a*y - 4.*z - 4.*x - z*z ;
        target.z = -a*z - 4.*x - 4.*y - x*x ;
        
        return target * t;
      } 

    // halvorsen attractor derivative ---------------------
    vec3 HalvorsenAttractorD(vec3 pos){
        const float a = 1.89;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = -a - 4. - 2. * y; 
        target.y = -a - 4. - 2. * z; 
        target.z = -a - 4. - 2. * x;
        
        return target;
      } 
    //-----------------------------------------------------

    // Noose Hover attractor ------------------------------
    vec3 nooseHoverAttractor(vec3 pos, float dt){
        const float a = 1.5;	

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = y ;
        target.y = -x + y*z;
        target.z = a - y*y;

        return target *dt ;
    }
    //---------------------------------------------------
    
    // rucklidge attractor ------------------------------
    vec3 rucklidgeAttractor(vec3 pos, float dt){
        const float k = 2.;	
        const float a = 6.7;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = -k*x + a*y -y*z ;
        target.y = x;
        target.z = -z + y*y;
        
        return target *dt ;
    }
    //---------------------------------------------------
    
    //dadrasAttractor ----------------------------------------

    vec3 dadrasAttractor(vec3 pos, float t){
      float a = 3.;
      float b = 2.7;
      float c = 1.7;
      float d = 2.;
      float e = 9.;

      vec3 target = vec3(0);
      float x = pos.x;
      float y = pos.y;
      float z = pos.z;

      target.x = (y- a*x +b*y*z) ;
      target.y = (c*y -x*z +z) ;
      target.z = (d*x*y - e*z);
      return target * t;
    }
    
    // sakarya attractor ------------------------------
    vec3 sakaryaAttractor(vec3 pos, float dt){
        const float a = .4;	
        const float b = .3;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = -x + y + y*z ;
        target.y = -x -y + a*x*z;
        target.z = z - b*x*y;

        return target *dt ;
      }
    //---------------------------------------------------
    
    // arneodo attractor ------------------------------
    vec3 arneodoAttractor(vec3 pos, float dt){
        const float a = -5.5;	
        const float b = 3.5;
        const float c = -1.;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = y ;
        target.y = z;
        target.z = -a*x - b*y -z +c *x*x*x;
        return target *dt ;
    }
    //---------------------------------------------------

    // bouali attractor ------------------------------
    vec3 boualiAttractor(vec3 pos, float dt){
        const float a = .3;	
        const float s = 1.;
        const float c = -1.;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = x*(4. - y) + a*z ;
        target.y = -y*(1. - x*x);
        target.z = -x*(1.5 - s *z ) -0.05*z;
        return target *dt ;
    }
    //---------------------------------------------------
     
    vec3 hadleyAttractor(vec3 pos, float dt){
        const float a = 1.8;	
        const float b = -.07;
        const float d = 1.5;
        const float m = .02;
        const float e = .25;
        const float f = .1;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;
        
        target.x = a*(x-y);
        target.y = -4.*a*y + x*z + m*x*x*x;
        target.z = -d*a*z + x*y + b*z*z;

        return target *dt ;
      }

      vec3 sprottAttractor(vec3 pos, float dt){
        const float a = -.759;	
        const float b = 2.449;
        const float c = 1.253;
        const float d = 1.5;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        // sprott R
        target.x = .9 - y;
        target.y = .4+z;
        target.z = x*y - z;


        // sprott B
        // target.x = y *z;
        // target.y = x-y;
        // target.z = 1. - x*y;

        // sprott A
        // target.x = y ;
        // target.y = -x + y*z;
        // target.z = 1. - y*y;
        return target *dt ;
      }

      vec3 lorenzMod2attractor(vec3 pos, float dt){
        const float a = .9;	
        const float b = 5.;
        const float c = 9.9;
        const float d = 1.;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = -a *x + y*y - z*z + a*c;
        target.y = x*(y - b*z) + d;
        target.z = z + x * (b*y + z);
        return target *dt ;
      }

      vec3 lorenzMod1attractor(vec3 pos, float dt){
        const float a = .1;	
        const float b = 4.;
        const float c = 14.;
        const float d = .08;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = -a *x + y*y - z*z + a*c;
        target.y = x*(y - b*z) + d;
        target.z = z + x * (b*y + z);
        return target *dt ;
      }

      vec3 fourWing3attractor(vec3 pos, float dt){
        const float a = 10.;	
        const float b = 40.;
        const float c = 2.;
        const float d = 2.5;

        vec3 target = vec3(0);
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;

        target.x = x + y + y*z;
        target.y = y*z - x*z;
        target.z = -z - x*y + 1. ;
        return target *dt ;
      }


`;
